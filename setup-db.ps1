$env:DATABASE_URL = "postgresql://neondb_owner:npg_b0JnhuB1DVYi@ep-dawn-sound-a57xyzr9-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
npx prisma generate
npx prisma db push 