import { db } from "./lib/db";

const email = process.argv[2];

if (!email) {
  console.error("Usage: npx tsx delete-user.ts <email>");
  process.exit(1);
}

async function deleteUser() {
  const user = await db.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log(`User ${email} not found.`);
    process.exit(0);
  }

  await db.user.delete({ where: { email } });
  console.log(`User ${email} deleted successfully!`);
  process.exit(0);
}

deleteUser().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});