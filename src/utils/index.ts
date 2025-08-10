// Meditation Category Images
import meditation1 from "/assets/images/meditation1.jpg";
import meditation2 from "/assets/images/meditation2.jpg";
import meditation3 from "/assets/images/meditation3.jpg";

// Pranayama Category Images  
import pranayama1 from "/assets/images/pranayama1.jpg";
import pranayama2 from "/assets/images/pranayama2.jpg";
import pranayama3 from "/assets/images/pranayama3.jpg";

// Mantra Category Images
import mantra1 from "/assets/images/mantra1.jpg";
import mantra2 from "/assets/images/mantra2.jpg";
import mantra3 from "/assets/images/mantra3.jpg";

// Knowledge Category Images
import knowledge1 from "/assets/images/knowledge1.jpg";
import knowledge2 from "/assets/images/knowledge2.jpg";
import knowledge3 from "/assets/images/knowledge3.jpg";

// Yoga Category Images
import yoga1 from "/assets/images/yoga1.jpg";
import yoga2 from "/assets/images/yoga2.jpg";
import yoga3 from "/assets/images/yoga3.jpg";

// Original Screen Images (fallbacks)
import screen1 from "/assets/images/screen1.jpg";
import screen2 from "/assets/images/screen2.jpg";
import screen3 from "/assets/images/screen3.jpg";
import screen4 from "/assets/images/screen4.jpg";
import screen5 from "/assets/images/screen5.jpg";
import screen6 from "/assets/images/screen6.jpg";
import screen7 from "/assets/images/screen7.jpg";
import screen8 from "/assets/images/screen8.jpg";


// Category-specific exports for future use
export const MeditationScreens = {
  primary: meditation1,
  secondary: meditation2,
  tertiary: meditation3,
  fallback: screen1
};

export const PranayamaScreens = {
  primary: pranayama1,
  secondary: pranayama2,
  tertiary: pranayama3,
  fallback: screen2
};

export const MantraScreens = {
  primary: mantra1,
  secondary: mantra2,
  tertiary: mantra3,
  fallback: screen3
};

export const KnowledgeScreens = {
  primary: knowledge1,
  secondary: knowledge2,
  tertiary: knowledge3,
  fallback: screen4
};

export const YogaScreens = {
  primary: yoga1,
  secondary: yoga2,
  tertiary: yoga3,
  fallback: screen5
};

// All available screens for dynamic loading
export const AllScreens = [
  meditation1, pranayama1, mantra1, knowledge1, yoga1,
  meditation2, pranayama2, mantra2, knowledge2, yoga2,
  meditation3, pranayama3, mantra3, knowledge3, yoga3,
  screen6, screen7, screen8
];

// Legacy exports for backward compatibility
export const Meditation1 = meditation1;
export const Meditation2 = meditation2;
export const Meditation3 = meditation3;
export const Pranayama1 = pranayama1;
export const Pranayama2 = pranayama2;
export const Pranayama3 = pranayama3;
export const Mantra1 = mantra1;
export const Mantra2 = mantra2;
export const Mantra3 = mantra3;
export const Knowledge1 = knowledge1;
export const Knowledge2 = knowledge2;
export const Knowledge3 = knowledge3;
export const Yoga1 = yoga1;
export const Yoga2 = yoga2;
export const Yoga3 = yoga3;


export const DhyanApp = screen1;
export const Home = screen2;
export const Articles = screen3;
export const AudioBooks = screen4;
export const Pravachans = screen5;
export const Motivation = screen6;
export const GuruBot = screen7;
export const Books = screen8;