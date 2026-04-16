/**
 * Build a metal-specific weight label (e.g. "Silver Weight", "Gold Weight")
 * from a metalType object or its name string. Falls back to "Metal Weight"
 * when the metal is unknown.
 *
 * Accepts either the full metalType object (`{ name: "SILVER", ... }`) or a
 * raw string ("silver", "Gold", "gold"). Case-insensitive.
 */
export function getMetalWeightLabel(metalTypeOrName) {
  if (!metalTypeOrName) return "Metal Weight";
  const raw =
    typeof metalTypeOrName === "string"
      ? metalTypeOrName
      : metalTypeOrName?.name || "";
  if (!raw) return "Metal Weight";
  const normalized =
    raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  return `${normalized} Weight`;
}

export default getMetalWeightLabel;
