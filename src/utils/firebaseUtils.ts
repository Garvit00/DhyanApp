import { collection, getDocs, DocumentData } from "firebase/firestore";
import { firestore } from "../firebase";

// TypeScript interface for Social data
export interface SocialData {
  heading: string;
  image: string;
  paragraph: string;
}

// TypeScript interfaces for Testimonial data
export interface TestimonialData {
  text: string;
  name: string;
  image: string;
  stars: number;
}

export interface TestimonialCardStyles {
  active: string;
  inactive: string;
  starIcon: string;
}

export interface TestimonialFirebaseData {
  cardStyles: TestimonialCardStyles;
  reviews: TestimonialData[];
}

// Generic function to fetch data from Firebase
export const fetchFirebaseData = async (
  collectionPath: string[]
): Promise<DocumentData[]> => {
  try {
    const collectionRef = collection(firestore, ...(collectionPath as [string, ...string[]]));
    const snapshot = await getDocs(collectionRef);
    
    const data: DocumentData[] = [];
    snapshot.forEach((doc) => {
      data.push(doc.data());
    });
    
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${collectionPath.join('/')}:`, error);
    throw error;
  }
};

// Specific function for Social data
export const fetchSocialData = async (): Promise<SocialData[]> => {
  // Try different Firebase paths in case the structure is different
  const possiblePaths = [
    ["Website_New", "86TJ2c4q1WqM1sqYXgKJ", "Social"],
    ["Website_New", "Social"],
    ["Social"]
  ];

  for (const path of possiblePaths) {
    try {
      console.log(`Trying Firebase path: ${path.join('/')}`);
      const socialData = await fetchFirebaseData(path);
      
      console.log("Raw Firebase data:", socialData);
      
      if (socialData.length > 0) {
        // Handle both array format and individual document format
        let dataToProcess = socialData;
        
        // If the first item is an array (like your data structure), use it
        if (Array.isArray(socialData[0])) {
          dataToProcess = socialData[0];
        }
        
        const mappedData = dataToProcess.map((doc: any) => ({
          heading: doc.heading || "",
          image: doc.image || "",
          paragraph: doc.paragraph || ""
        }));
        
        console.log("Mapped social data:", mappedData);
        
        // If we got valid data, return it
        if (mappedData.some(item => item.heading && item.image)) {
          console.log("Successfully fetched data from Firebase");
          return mappedData;
        }
      }
    } catch (error) {
      console.log(`Failed to fetch from path ${path.join('/')}:`, error);
      continue;
    }
  }
  
  // If no data from Firebase, return fallback data
  console.log("No data from Firebase, using fallback data");
  return [
    {
      heading: "Spiritual Community",
      image: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FSocial%2Fsocial_mock.png?alt=media&token=779fd8cf-40f2-4dc6-b5fc-d230445e3b96",
      paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      heading: "Track your Progress",
      image: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FSocial%2Fprogress_mock.png?alt=media&token=349440ef-a7b0-4b76-a69d-88ea3445e6dd",
      paragraph: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    }
  ];
};

// Specific function for Testimonial data
export const fetchTestimonialData = async (): Promise<TestimonialFirebaseData> => {
  // Try different Firebase paths in case the structure is different
  const possiblePaths = [
    ["Website_New", "86TJ2c4q1WqM1sqYXgKJ", "Testimonials"],
    ["Website_New", "Testimonials"],
    ["Testimonials"]
  ];

  for (const path of possiblePaths) {
    try {
      console.log(`Trying Firebase path for testimonials: ${path.join('/')}`);
      const testimonialData = await fetchFirebaseData(path);
      
      console.log("Raw Firebase testimonial data:", testimonialData);
      
      if (testimonialData.length > 0) {
        const data = testimonialData[0]; // Get the first document
        const cardStyles = data.cardStyles || {
          active: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FTestimonials%2Ftestimonial_card.svg?alt=media&token=46cc5b30-6ac2-4e91-95c5-169a44845943",
          inactive: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FTestimonials%2Ftestimonial_card2.svg?alt=media&token=095b7377-345c-4231-93e9-e0d1ab4675aa",
          starIcon: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FTestimonials%2Fstar.svg?alt=media&token=7242e9b8-0571-4e00-abb4-26da30bd6373"
        };
        
        // Handle both 'reviews' and 'reviews ' (with trailing space) field names
        const reviews = data.reviews || data['reviews '] || [];
        
        // Normalize the reviews data to handle both 'stars' and 'star' field names
        const normalizedReviews = reviews.map((review: any) => ({
          text: review.text || "",
          name: review.name || "",
          image: review.image || "",
          stars: review.stars || review.star || 5 // Handle both 'stars' and 'star' field names
        }));
        
        console.log("Mapped testimonial data:", { cardStyles, reviews: normalizedReviews });
        
        // If we got valid data, return it
        if (normalizedReviews.length > 0) {
          console.log("Successfully fetched testimonial data from Firebase");
          return { cardStyles, reviews: normalizedReviews };
        }
      }
    } catch (error) {
      console.log(`Failed to fetch testimonials from path ${path.join('/')}:`, error);
      continue;
    }
  }
  
  // If no data from Firebase, return fallback data
  console.log("No testimonial data from Firebase, using fallback data");
  return {
    cardStyles: {
      active: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FTestimonials%2Ftestimonial_card.svg?alt=media&token=46cc5b30-6ac2-4e91-95c5-169a44845943",
      inactive: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FTestimonials%2Ftestimonial_card2.svg?alt=media&token=095b7377-345c-4231-93e9-e0d1ab4675aa",
      starIcon: "https://firebasestorage.googleapis.com/v0/b/dhyanapp-90de4.appspot.com/o/Website_New%2FTestimonials%2Fstar.svg?alt=media&token=7242e9b8-0571-4e00-abb4-26da30bd6373"
    },
    reviews: [
      {
        text: "Dhyan has completely transformed my meditation practice. The guided sessions are incredibly calming and the progress tracking keeps me motivated. I've never felt more centered and peaceful in my daily life.",
        name: "Sarah Chen",
        image: "/profile.png",
        stars: 5,
      },
      {
        text: "As someone who struggled with stress and anxiety, Dhyan has been a game-changer. The breathing exercises and mindfulness techniques have helped me find inner peace. Highly recommend to anyone seeking mental wellness.",
        name: "Michael Rodriguez",
        image: "/profile.png",
        stars: 5,
      },
      {
        text: "The community feature in Dhyan is amazing! I've connected with like-minded people who share my spiritual journey. The app has become an essential part of my daily routine.",
        name: "Priya Patel",
        image: "/profile.png",
        stars: 5,
      },
      {
        text: "I've tried many meditation apps, but Dhyan stands out with its authentic approach to spiritual wellness. The variety of practices and beautiful interface make meditation truly enjoyable.",
        name: "David Thompson",
        image: "/profile.png",
        stars: 5,
      },
      {
        text: "Dhyan helped me establish a consistent meditation practice. The gentle reminders and diverse content keep me engaged. My stress levels have significantly decreased since I started using the app.",
        name: "Emma Wilson",
        image: "/profile.png",
        stars: 5,
      },
      {
        text: "The pranayama exercises in Dhyan are exceptional. I've noticed improved focus and energy levels. This app has become my go-to for spiritual and physical wellness.",
        name: "Amit Kumar",
        image: "/profile.png",
        stars: 5,
      }
    ]
  };
}; 