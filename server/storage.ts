import {
  users,
  services,
  serviceOfferings,
  bookings,
  reviews,
  favorites,
  type User,
  type UpsertUser,
  type Service,
  type InsertService,
  type ServiceOffering,
  type InsertServiceOffering,
  type Booking,
  type InsertBooking,
  type Review,
  type InsertReview,
  type Favorite,
  type InsertFavorite,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Service operations
  getServices(params: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<Service[]>;
  getServiceById(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, updates: Partial<InsertService>): Promise<Service>;
  
  // Service offerings operations
  getServiceOfferings(serviceId: string): Promise<ServiceOffering[]>;
  createServiceOffering(offering: InsertServiceOffering): Promise<ServiceOffering>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getUserBookings(userId: string): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking | undefined>;
  updateBookingStatus(id: string, status: string): Promise<Booking>;
  
  // Review operations
  getServiceReviews(serviceId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Favorite operations
  getUserFavorites(userId: string): Promise<Service[]>;
  addToFavorites(userId: string, serviceId: string): Promise<Favorite>;
  removeFromFavorites(userId: string, serviceId: string): Promise<void>;
  isFavorite(userId: string, serviceId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Service operations
  async getServices(params: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<Service[]> {
    let query = db.select().from(services).where(eq(services.isActive, true));

    if (params.category) {
      query = query.where(eq(services.category, params.category));
    }

    // If location is provided, order by distance
    if (params.latitude && params.longitude) {
      const distanceFormula = sql`(
        6371 * acos(
          cos(radians(${params.latitude})) * 
          cos(radians(${services.latitude})) * 
          cos(radians(${services.longitude}) - radians(${params.longitude})) + 
          sin(radians(${params.latitude})) * 
          sin(radians(${services.latitude}))
        )
      )`;
      
      query = query.orderBy(distanceFormula);
      
      if (params.radius) {
        query = query.having(sql`${distanceFormula} <= ${params.radius}`);
      }
    } else {
      query = query.orderBy(desc(services.rating));
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.offset) {
      query = query.offset(params.offset);
    }

    return await query;
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: string, updates: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  // Service offerings operations
  async getServiceOfferings(serviceId: string): Promise<ServiceOffering[]> {
    return await db
      .select()
      .from(serviceOfferings)
      .where(and(eq(serviceOfferings.serviceId, serviceId), eq(serviceOfferings.isActive, true)))
      .orderBy(asc(serviceOfferings.price));
  }

  async createServiceOffering(offering: InsertServiceOffering): Promise<ServiceOffering> {
    const [newOffering] = await db.insert(serviceOfferings).values(offering).returning();
    return newOffering;
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.bookingDate));
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  // Review operations
  async getServiceReviews(serviceId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.serviceId, serviceId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update service rating
    const avgRating = await db
      .select({ avg: sql<number>`avg(${reviews.rating})` })
      .from(reviews)
      .where(eq(reviews.serviceId, review.serviceId));
    
    const reviewCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.serviceId, review.serviceId));

    await db
      .update(services)
      .set({
        rating: avgRating[0]?.avg?.toString(),
        reviewCount: reviewCount[0]?.count || 0,
      })
      .where(eq(services.id, review.serviceId));

    return newReview;
  }

  // Favorite operations
  async getUserFavorites(userId: string): Promise<Service[]> {
    const favoriteServices = await db
      .select({
        id: services.id,
        name: services.name,
        description: services.description,
        category: services.category,
        address: services.address,
        latitude: services.latitude,
        longitude: services.longitude,
        phone: services.phone,
        email: services.email,
        rating: services.rating,
        reviewCount: services.reviewCount,
        priceRange: services.priceRange,
        images: services.images,
        amenities: services.amenities,
        workingHours: services.workingHours,
        isActive: services.isActive,
        createdAt: services.createdAt,
        updatedAt: services.updatedAt,
      })
      .from(favorites)
      .innerJoin(services, eq(favorites.serviceId, services.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));

    return favoriteServices;
  }

  async addToFavorites(userId: string, serviceId: string): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values({ userId, serviceId })
      .returning();
    return favorite;
  }

  async removeFromFavorites(userId: string, serviceId: string): Promise<void> {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.serviceId, serviceId)));
  }

  async isFavorite(userId: string, serviceId: string): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.serviceId, serviceId)));
    return !!favorite;
  }
}

export const storage = new DatabaseStorage();
