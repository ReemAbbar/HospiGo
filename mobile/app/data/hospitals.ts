// app/data/hospitals.ts

export interface Hospital {
  id: string;
  name: string;
  address: string;
  image: string;
  rating: number;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  availableTimes: string[];
  doctors: Doctor[]; // Added doctors array
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  image: string;
  experience: number; // Years of experience
}

export interface Appointment {
  _id: string;
  userId: string;
  hospitalId: string;
  hospitalName: string;
  categoryId: string;
  categoryName: string;
  doctorId: string; // Added doctor ID
  doctorName: string; // Added doctor name
  date: string;
  time: string;
  status: "upcoming" | "confirmed" | "cancelled";
  createdAt?: Date;
}

export const hospitals: Hospital[] = [
  {
    id: "1",
    name: "Salmaniya Medical Complex",
    address: "Zinj, Salmaniya, Manama",
    image:
      "https://bahrainhealth.com/wp-content/uploads/2024/01/2023-07-25-1.jpg",
    rating: 4.5,
    categories: [
      {
        id: "101",
        name: "Cardiology",
        description: "Heart and cardiovascular system specialists",
        availableTimes: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        doctors: [
          {
            id: "d101",
            name: "Dr. Ahmed Khalil",
            specialization: "Interventional Cardiology",
            image: "https://media.istockphoto.com/id/1328647215/photo/mature-male-doctor-standing-and-smiling.jpg?s=612x612&w=0&k=20&c=cBEjVvlVfnzkx7_hysMGkunIHdfyRf5JXcGdOHbkX_E=",
            experience: 12,
          },
          {
            id: "d102",
            name: "Dr. Sara Al-Mansoor",
            specialization: "Cardiac Electrophysiology",
            image: "https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA=",
            experience: 8,
          },
        ],
      },
      {
        id: "102",
        name: "Dentistry",
        description: "Dental care and oral health",
        availableTimes: ["09:30", "10:30", "11:30", "14:30", "15:30"],
        doctors: [
          {
            id: "d103",
            name: "Dr. Mohammed Al-Hasan",
            specialization: "Orthodontics",
            image: "https://media.istockphoto.com/id/1328647215/photo/mature-male-doctor-standing-and-smiling.jpg?s=612x612&w=0&k=20&c=cBEjVvlVfnzkx7_hysMGkunIHdfyRf5JXcGdOHbkX_E=",
            experience: 10,
          },
          {
            id: "d104",
            name: "Dr. Fatima Al-Dosari",
            specialization: "Pediatric Dentistry",
            image: "https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA=",
            experience: 7,
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "BDF Royal Medical Services",
    address: "West Riffa, Bahrain",
    image:
      "https://bahrainhealth.com/wp-content/uploads/2024/01/2021-07-14.jpg",
    rating: 4.8,
    categories: [
      {
        id: "201",
        name: "Orthopedics",
        description: "Musculoskeletal system specialists",
        availableTimes: ["08:00", "09:00", "13:00", "14:00", "16:00"],
        doctors: [
          {
            id: "d201",
            name: "Dr. Khalid Al-Thani",
            specialization: "Sports Medicine",
            image: "https://media.istockphoto.com/id/1328647215/photo/mature-male-doctor-standing-and-smiling.jpg?s=612x612&w=0&k=20&c=cBEjVvlVfnzkx7_hysMGkunIHdfyRf5JXcGdOHbkX_E=",
            experience: 15,
          },
          {
            id: "d202",
            name: "Dr. Layla Al-Shemali",
            specialization: "Joint Replacement",
            image: "https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA=",
            experience: 9,
          },
        ],
      },
      {
        id: "202",
        name: "Pediatrics",
        description: "Medical care for children and adolescents",
        availableTimes: ["10:00", "11:00", "13:30", "15:00", "16:30"],
        doctors: [
          {
            id: "d203",
            name: "Dr. Nasser Al-Balushi",
            specialization: "Pediatric Cardiology",
            image: "https://media.istockphoto.com/id/1328647215/photo/mature-male-doctor-standing-and-smiling.jpg?s=612x612&w=0&k=20&c=cBEjVvlVfnzkx7_hysMGkunIHdfyRf5JXcGdOHbkX_E=",
            experience: 11,
          },
          {
            id: "d204",
            name: "Dr. Huda Al-Farsi",
            specialization: "Neonatology",
            image: "https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA=",
            experience: 14,
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "King Hamad Hospital",
    address: "Busaiteen, Muharraq Governorate",
    image: "https://www.eac-bs.com/site/images/king-hamad.png",
    rating: 4.6,
    categories: [
      {
        id: "301",
        name: "Dermatology",
        description: "Skin, hair, and nail specialists",
        availableTimes: ["09:15", "10:45", "13:15", "15:45"],
        doctors: [
          {
            id: "d301",
            name: "Dr. Nasser Al-Balushi",
            specialization: "Dermatologist",
            image: "https://media.istockphoto.com/id/1328647215/photo/mature-male-doctor-standing-and-smiling.jpg?s=612x612&w=0&k=20&c=cBEjVvlVfnzkx7_hysMGkunIHdfyRf5JXcGdOHbkX_E=",
            experience: 11,
          },
          {
            id: "d302",
            name: "Dr. Huda Al-Farsi",
            specialization: "Dermatologist",
            image: "https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA=",
            experience: 14,
          },
        ],
      },
      {
        id: "302",
        name: "Ophthalmology",
        description: "Eye and vision care specialists",
        availableTimes: ["08:30", "10:30", "13:30", "15:30"],
        doctors: [
          {
            id: "d303",
            name: "Dr. Nasser Al-Balushi",
            specialization: "Opthalmologist",
            image: "https://media.istockphoto.com/id/1328647215/photo/mature-male-doctor-standing-and-smiling.jpg?s=612x612&w=0&k=20&c=cBEjVvlVfnzkx7_hysMGkunIHdfyRf5JXcGdOHbkX_E=",
            experience: 11,
          },
          {
            id: "d304",
            name: "Dr. Huda Al-Farsi",
            specialization: "Opthalmologist",
            image: "https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA=",
            experience: 14,
          },
        ],
      },
    ],
  },
  {
    id: "4",
    name: "Jidhafs Health Centre",
    address: "Jidhafs, Capital Governorate",
    image:
      "https://bna-media.s3-eu-west-1.amazonaws.com/Media/Images/News/Local-News/Image%203-1033453c-3cc9-4672-87a0-cd8b260b10dc.jpeg",
    rating: 4.0,
    categories: [
      {
        id: "501",
        name: "Internal Medicine",
        description: "Comprehensive diagnosis and care",
        availableTimes: ["08:30", "10:00", "12:00", "14:00", "16:00"],
        doctors: [
          {
            id: "d401",
            name: "Dr. Nasser Al-Balushi",
            specialization: "Internal Medicine",
            image: "https://media.istockphoto.com/id/1328647215/photo/mature-male-doctor-standing-and-smiling.jpg?s=612x612&w=0&k=20&c=cBEjVvlVfnzkx7_hysMGkunIHdfyRf5JXcGdOHbkX_E=",
            experience: 11,
          },
          {
            id: "d402",
            name: "Dr. Huda Al-Farsi",
            specialization: "Internal Medicine",
            image: "https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA=",
            experience: 14,
          },
        ],
      },
      {
        id: "502",
        name: "Gynecology",
        description: "Women’s reproductive health",
        availableTimes: ["09:30", "11:00", "13:30", "15:30"],
        doctors: [
          {
            id: "d403",
            name: "Dr. Nasser Al-Balushi",
            specialization: "Gynaecologist",
            image: "https://media.istockphoto.com/id/1328647215/photo/mature-male-doctor-standing-and-smiling.jpg?s=612x612&w=0&k=20&c=cBEjVvlVfnzkx7_hysMGkunIHdfyRf5JXcGdOHbkX_E=",
            experience: 11,
          },
          {
            id: "d404",
            name: "Dr. Huda Al-Farsi",
            specialization: "Gynaecologist",
            image: "https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA=",
            experience: 14,
          },
        ],
      },
    ],
  },
  {
    id: "5",
    name: "Al Hilal Hospital",
    address: "123 Main Street, Downtown",
    image: "https://inventemr.com/portal/images/849/medicalfirmgallary/gallary_174/Al_Hilal_Hospital_-_Hamad_Town_medical_bh_invent_its_bahrain_gallary_b70fc334_98249343.jpg",
    rating: 4.5,
    categories: [
      {
        id: "601",
        name: "Cardiology",
        description: "Heart and cardiovascular system specialists",
        availableTimes: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        doctors: [
          {
            id: "d501",
            name: "Dr. Nasser Al-Balushi",
            specialization: "Pediatric Cardiology",
            image: "https://media.istockphoto.com/id/1328647215/photo/mature-male-doctor-standing-and-smiling.jpg?s=612x612&w=0&k=20&c=cBEjVvlVfnzkx7_hysMGkunIHdfyRf5JXcGdOHbkX_E=",
            experience: 11,
          },
          {
            id: "d502",
            name: "Dr. Huda Al-Farsi",
            specialization: "Neonatology",
            image: "https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA=",
            experience: 14,
          },
        ],
      },
      {
        id: "602",
        name: "Dentistry",
        description: "Dental care and oral health",
        availableTimes: ["09:30", "10:30", "11:30", "14:30", "15:30"],
        doctors: [
          {
            id: "d503",
            name: "Dr. Nasser Al-Balushi",
            specialization: "Dentist",
            image: "https://media.istockphoto.com/id/1328647215/photo/mature-male-doctor-standing-and-smiling.jpg?s=612x612&w=0&k=20&c=cBEjVvlVfnzkx7_hysMGkunIHdfyRf5JXcGdOHbkX_E=",
            experience: 11,
          },
          {
            id: "d504",
            name: "Dr. Huda Al-Farsi",
            specialization: "Dentist",
            image: "https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA=",
            experience: 14,
          },
        ],
      },
    ],
  },
  {
    id: "6",
    name: "Royal Bahrain Hospital",
    address: "Manama, Zinj",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-cSjL9MZVeSFupJXB__5qU_1lcuZhyBTeKw&s",
    rating: 4.5,
    categories: [
      {
        id: "701",
        name: "Nephrology",
        description: "Heart and cardiovascular system specialists",
        availableTimes: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
        doctors: [
          {
            id: "d501",
            name: "Dr. Mohammad Al-Pakistani",
            specialization: "Nephrology",
            image: "https://media.istockphoto.com/id/1328647215/photo/mature-male-doctor-standing-and-smiling.jpg?s=612x612&w=0&k=20&c=cBEjVvlVfnzkx7_hysMGkunIHdfyRf5JXcGdOHbkX_E=",
            experience: 11,
          },
          {
            id: "d502",
            name: "Dr. Reem Al-Abbar",
            specialization: "Specialized Nephrology",
            image: "https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA=",
            experience: 14,
          },
        ],
      },
      {
        id: "702",
        name: "Dentistry",
        description: "Dental care and oral health",
        availableTimes: ["09:30", "10:30", "11:30", "14:30", "15:30"],
        doctors: [
          {
            id: "d503",
            name: "Dr. Nasser Al-Balushi",
            specialization: "Dentist",
            image: "https://media.istockphoto.com/id/1328647215/photo/mature-male-doctor-standing-and-smiling.jpg?s=612x612&w=0&k=20&c=cBEjVvlVfnzkx7_hysMGkunIHdfyRf5JXcGdOHbkX_E=",
            experience: 11,
          },
          {
            id: "d504",
            name: "Dr. Huda Al-Farsi",
            specialization: "Dentist",
            image: "https://media.istockphoto.com/id/1373258655/photo/happy-nurse-at-hospital.jpg?s=612x612&w=0&k=20&c=mt8_LDMnWZHxAVm64SjmqBqbsTnrmDI3DlCq-jv3afA=",
            experience: 14,
          },
        ],
      },
    ],
  },
];
