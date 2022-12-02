export const corpList = [
  "Point Luna",
  "Vitor",
  "Valley Trust",
  "CrediCor",
  "Teractor",
  "Ringcom",
  "EcoLine",
  "Tharsis Republic",
  "Arklight",
  "Poseidon",
  "Splice",
  "Helion",
  "Lakefront Resorts",
  "Saturn Systems",
  "Inventrix",
  "Aridor",
  "PhoboLog",
  "Cheung Shing MARS",
  "Polyphemos",
  "Midas",
  "Factorum",
  "Bio-Sol",
  "Project Workshop",
  "Pharmacy Union",
  "Thorgate",
  //   "Utopia Invest",
  //   "Beginner Corporation",
  //   "Mons Insurance",
  //   "Manutech",
  //   "Curiosity II",
  //   "Philares",
  //   "Celestic",

  //   "Viron",
  //   "Playwrights",
  //   "Morning Star Inc.",
  //   "Chimera",
  //   "Pristar",
];

export const createCorpSelectOptions = () => {
  return corpList.map((corp) => {
    return {
      label: corp,
      description: "Corp Name",
      value: corp,
    };
  });
};
