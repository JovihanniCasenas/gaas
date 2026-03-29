alter table "public"."comments" add column "updated_at" timestamp with time zone default now();

alter table "public"."prices" add column "updated_at" timestamp with time zone default now();

alter table "public"."stations" add column "updated_at" timestamp with time zone default now();

alter table "public"."stations" add column "updated_by" uuid;

alter table "public"."stations" add constraint "stations_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.users(id) not valid;

alter table "public"."stations" validate constraint "stations_updated_by_fkey";


