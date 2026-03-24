// Mock data for Division -> District -> Thana dependent dropdowns
export const locationsData = {
  divisions: ["Dhaka", "Chittagong", "Sylhet", "Rajshahi"],
  districts: {
    Dhaka: ["Dhaka", "Faridpur", "Gazipur", "Gopalganj"],
    Chittagong: ["Chittagong", "Cox's Bazar", "Comilla", "Feni"],
    Sylhet: ["Sylhet", "Habiganj", "Moulvibazar", "Sunamganj"],
    Rajshahi: ["Rajshahi", "Bogra", "Pabna", "Sirajganj"],
  },
  thanas: {
    // Dhaka Districts
    Dhaka: ["Dhanmondi", "Gulshan", "Mirpur", "Uttara", "Mohammadpur"],
    Faridpur: ["Faridpur Sadar", "Boalmari", "Madhukhali"],
    Gazipur: ["Gazipur Sadar", "Kaliakair", "Kapasia"],
    Gopalganj: ["Gopalganj Sadar", "Kotalipara", "Tungipara"],
    
    // Chittagong Districts
    Chittagong: ["Panchlaish", "Double Mooring", "Pahartali"],
    "Cox's Bazar": ["Cox's Bazar Sadar", "Teknaf", "Ukhia"],
    Comilla: ["Comilla Sadar", "Laksam", "Daudkandi"],
    Feni: ["Feni Sadar", "Daganbhuiyan", "Sonagazi"],
    
    // Sylhet Districts
    Sylhet: ["Sylhet Sadar", "South Surma", "Jaintiapur"],
    Habiganj: ["Habiganj Sadar", "Nabiganj", "Chunarughat"],
    Moulvibazar: ["Moulvibazar Sadar", "Sreemangal", "Kulaura"],
    Sunamganj: ["Sunamganj Sadar", "Chhatak", "Tahirpur"],

    // Rajshahi Districts
    Rajshahi: ["Boalia", "Rajpara", "Motihar"],
    Bogra: ["Bogra Sadar", "Shibganj", "Sherpur"],
    Pabna: ["Pabna Sadar", "Ishwardi", "Bera"],
    Sirajganj: ["Sirajganj Sadar", "Shahjadpur", "Belkuchi"],
  }
};
