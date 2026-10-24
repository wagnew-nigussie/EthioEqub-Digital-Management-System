import { seedIfEmpty } from "../src/services/seedService";

async function main() {
  await seedIfEmpty(true);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
