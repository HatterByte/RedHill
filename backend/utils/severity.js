/**
 * Determines complaint severity based on type and subtype
 * @param {string} type - The main category of the complaint
 * @param {string} subtype - The specific subcategory of the complaint
 * @returns {string} - Returns 'High', 'Medium', or 'Low' based on the type and subtype
 */
export const determineSeverity = (type, subtype) => {
  // Medical and Security issues are generally high priority
  if (type === "Medical Assistance") {
    return "High";
  }

  // Security issues with varying severity
  if (type === "Security") {
    const highSeveritySecurityIssues = [
      "Eve-teasing/Misbehaviour with lady passengers/Rape",
      "Theft of Passengers Belongings/Snatching",
      "Dacoity/Robbery/Murder/Riots",
      "Passenger Missing/Not responding call",
      "Passenger fallen down",
    ];

    const mediumSeveritySecurityIssues = [
      "Unauthorized person in Ladies/Disabled 03/1 Comp Coach/SLR/Reserve Coach",
      "Harassment/Extortion by Security Personnel/Railway personnel",
      "Smoking/Drinking Alcohol/Narcotics",
      "Quarrelling/Hooliganism",
    ];

    if (highSeveritySecurityIssues.includes(subtype)) {
      return "High";
    }
    if (mediumSeveritySecurityIssues.includes(subtype)) {
      return "Medium";
    }
    return "Low";
  }

  // Facilities related to special needs passengers
  if (
    type === "Divyangjan Facilities" ||
    type === "Facilities for Women with Special Needs"
  ) {
    return "Medium";
  }

  // Basic amenities and maintenance issues
  if (type === "Electrical Equipment") {
    if (["Air Conditioner", "Lights"].includes(subtype)) {
      return "Medium";
    }
    return "Low";
  }

  // Cleanliness and hygiene issues
  if (type === "Coach-Cleanliness") {
    if (["Toilet", "Cockroach / Rodents"].includes(subtype)) {
      return "Medium";
    }
    return "Low";
  }

  // Train operation issues
  if (type === "Punctuality") {
    if (subtype === "Late Running") {
      return "Medium";
    }
    return "Low";
  }

  // Basic necessities
  if (type === "Water Availability") {
    if (subtype === "Packages Drinking Water / Rail Neer") {
      return "Medium";
    }
    return "Low";
  }

  // Maintenance issues
  if (type === "Coach - Maintenance") {
    const highSeverityMaintenance = ["Window/Door locking problem"];
    if (highSeverityMaintenance.includes(subtype)) {
      return "High";
    }
    return "Medium";
  }

  // Catering and service issues
  if (type === "Catering & Vending Services") {
    if (
      ["Food Quality & Quantity", "Food & Water Not Available"].includes(
        subtype
      )
    ) {
      return "Medium";
    }
    return "Low";
  }

  // Staff conduct issues
  if (type === "Staff Behaviour" || type === "Corruption/ Bribery") {
    return "Medium";
  }

  // Comfort issues
  if (type === "Bed Roll") {
    return "Low";
  }

  // Default severity for unspecified categories
  return "Low";
};
