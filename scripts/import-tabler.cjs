const { glob, readFile, mkdir, cp, rm } = require("node:fs/promises");

const main = async () => {
  const matches = await glob("src/**/*.{ts,tsx}");
  const iconSet = new Set();

  for await (const match of matches) {
    const content = await readFile(match, "utf-8");
    const tablerIcons = content.matchAll(/tabler\/((?:outline|filled)\/[a-z0-9-]+)\.svg/g);

    for (const [, icon] of tablerIcons) {
      iconSet.add(icon);
    }
  }

  console.log(`[tabler] found ${iconSet.size} icons`);

  try {
    await rm("assets/tabler", { recursive: true });

    console.log("[tabler] remove assets/tabler");
  } catch {
    // ignore
  }

  await mkdir("assets/tabler/outline", { recursive: true });
  await mkdir("assets/tabler/filled", { recursive: true });

  for (const icon of [...iconSet]) {
    const [style, name] = icon.split("/");

    console.log(`[tabler] coping ${style}/${name} from @tabler/icons`);

    await cp(`node_modules/@tabler/icons/icons/${style}/${name}.svg`, `assets/tabler/${style}/${name}.svg`);
  }
};

main();
