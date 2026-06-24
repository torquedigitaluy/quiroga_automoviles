function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Pretty, shareable URL segment for a vehicle: name + year + short id for uniqueness. */
export function vehicleSlug(vehicle: { name: string; year: number; id: string }): string {
  const shortId = vehicle.id.split("-")[0];
  return `${slugify(`${vehicle.name} ${vehicle.year}`)}-${shortId}`;
}

/** Recovers the short id suffix appended by vehicleSlug(), to look the vehicle back up. */
export function shortIdFromSlug(slug: string): string {
  const parts = slug.split("-");
  return parts[parts.length - 1] ?? "";
}
