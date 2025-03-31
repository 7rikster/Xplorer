

generator client {
    provider = "prisma-client-js"
  }
  
  datasource db {
    provider = "mongodb"
    url      = env("DATABASE_URL")
  }
  
  
  model User {
    id String @id @default(auto()) @map("_id") @db.ObjectId
    firebaseIs String @unique
    name String
    email String @unique
    phoneNumber String
    photoUrl String
  
    role Role
  
    //trips Trip[]
  
    wishList Place[]
  }
  
  enum Role {
    CLIENT
    ADMIN
  }
  
  model Place {
    id String @id @default(auto()) @map("_id") @db.ObjectId
    placeId String @unique
    name String
    location String
    latitude String
    longitude String
    photoUrl String
  
    typeOfPlace TypeofPlace
  }
  
  enum TypeofPlace{
    DESTINATION
    EVENT
    HOTEL
    RESTAURANT
  }
  
  model Destination{
    id String @id @default(auto()) @map("_id") @db.ObjectId
    placeId String @unique
    name String
    location String
    latitude String
    longitude String
    photos String[]
    rating Int
  }