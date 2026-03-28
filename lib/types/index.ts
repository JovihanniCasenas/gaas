import type { Tables, TablesInsert, TablesUpdate } from "./supabase"

// Station
export type Station = Tables<"stations">
export type StationInsert = TablesInsert<"stations">
export type StationUpdate = TablesUpdate<"stations">

// Price
export type Price = Tables<"prices">
export type PriceInsert = TablesInsert<"prices">
export type PriceUpdate = TablesUpdate<"prices">

// Price with vote counts (view)
export type PriceWithVotes = Tables<"prices_with_votes">

// Vote
export type Vote = Tables<"votes">
export type VoteInsert = TablesInsert<"votes">
export type VoteUpdate = TablesUpdate<"votes">

// Comment
export type Comment = Tables<"comments">
export type CommentInsert = TablesInsert<"comments">
export type CommentUpdate = TablesUpdate<"comments">

// User
export type User = Tables<"users">
export type UserInsert = TablesInsert<"users">
export type UserUpdate = TablesUpdate<"users">

// SavedStation
export type SavedStation = Tables<"saved_stations">
export type SavedStationInsert = TablesInsert<"saved_stations">
export type SavedStationUpdate = TablesUpdate<"saved_stations">
