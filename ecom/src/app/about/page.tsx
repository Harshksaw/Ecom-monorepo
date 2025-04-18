'use client';

import {
    FaGem,
    FaCertificate,

    FaHandshake,
    FaHistory,
    FaUsers,
    FaMedal,
    FaHeart
} from 'react-icons/fa';
import Wrapper from '../components/Wrapper';

// Centralized variables for easy maintenance
const ABOUT_INFO = {
    // Header Section
    hero: {
        title: 'About Our Jewelry Store',
        subtitle: 'Crafting Timeless Elegance Since 1995',
        description: 'We are passionate about creating beautiful, high-quality jewelry that celebrates the special moments in your life. From engagement rings to anniversary gifts, our pieces are designed to be treasured for generations.',
        ctaText: 'View Our Collections',
        ctaLink: '/collections',
        heroImage: '/images/about/jewelry-workshop.jpg',
    },

    // Our Story Section
    story: {
        title: 'Our Story',
        content: [
            'Our journey began in 1995 when our founder, Anil Sharma, opened a small jewelry workshop in Mumbai with a vision to create pieces that combine traditional craftsmanship with contemporary design.',
            'What started as a modest family business has grown into one of India\'s most respected jewelry brands, while still maintaining the personal touch and attention to detail that defined us from the beginning.',
            'Today, we continue to honor our heritage while embracing innovation, using sustainable practices and ethically sourced materials to create jewelry that is as beautiful in its conception as in its creation.'
        ],
        founderImage: '/images/about/founder.jpg',
        founderName: 'Anil Sharma',
        founderTitle: 'Founder & Master Craftsman'
    },

    // Mission & Values Section
    mission: {
        title: 'Our Mission & Values',
        missionStatement: 'To create exquisite jewelry that celebrates life\'s precious moments, crafted with integrity, passion, and respect for our heritage and the environment.',
        values: [
            {
                title: 'Quality Craftsmanship',
                description: 'Every piece we create undergoes rigorous quality checks to ensure it meets our high standards.',
                icon: FaGem
            },
            {
                title: 'Ethical Sourcing',
                description: 'We source our materials responsibly, ensuring they meet ethical and environmental standards.',
                icon: FaCertificate
            },
            {
                title: 'Customer Service',
                description: 'We are committed to providing exceptional service and building lasting relationships with our clients.',
                icon: FaHandshake
            },
            {
                title: 'Timeless Design',
                description: 'We create pieces that transcend trends, designed to be cherished for generations.',
                icon: FaHeart
            }
        ]
    },

    // Our Team Section
    team: {
        title: 'Meet Our Team',
        subtitle: 'The talented individuals behind our beautiful creations',
        members: [
            {
                name: 'Priya Sharma',
                title: 'Head Designer',
                bio: 'With over 15 years of experience, Priya leads our design team with her innovative vision and meticulous attention to detail.',
                image: '/images/about/team-1.jpg'
            },
            {
                name: 'Rajesh Patel',
                title: 'Master Goldsmith',
                bio: 'Rajesh brings 20 years of traditional craftsmanship to our workshop, specializing in intricate goldwork and setting techniques.',
                image: '/images/about/team-2.jpg'
            },
            {
                name: 'Anjali Verma',
                title: 'Gemologist',
                bio: 'As our certified gemologist, Anjali ensures we source only the finest quality stones for our jewelry collections.',
                image: '/images/about/team-3.jpg'
            },
            {
                name: 'Vikram Singh',
                title: 'Production Manager',
                bio: 'Vikram oversees our entire production process, ensuring each piece meets our exacting standards for quality and craftsmanship.',
                image: '/images/about/team-4.jpg'
            }
        ]
    },

    // Timeline Section
    timeline: {
        title: 'Our Journey',
        events: [
            {
                year: '1995',
                title: 'The Beginning',
                description: 'Founded as a small workshop in Mumbai by Anil Sharma.'
            },
            {
                year: '2002',
                title: 'First Flagship Store',
                description: 'Opened our first retail location in South Mumbai.'
            },
            {
                year: '2008',
                title: 'National Expansion',
                description: 'Expanded to Delhi, Bangalore, and Chennai.'
            },
            {
                year: '2015',
                title: 'Online Store Launch',
                description: 'Embraced e-commerce with the launch of our online store.'
            },
            {
                year: '2018',
                title: 'Sustainability Initiative',
                description: 'Implemented eco-friendly practices across all operations.'
            },
            {
                year: '2023',
                title: 'International Presence',
                description: 'Opened our first international store in Dubai.'
            }
        ]
    },

    // Stats Section
    stats: {
        title: 'By the Numbers',
        items: [
            {
                value: '28+',
                label: 'Years in Business',
                icon: FaHistory
            },
            {
                value: '15+',
                label: 'Store Locations',
                icon: FaMapMarkerAlt
            },
            {
                value: '50,000+',
                label: 'Happy Customers',
                icon: FaUsers
            },
            {
                value: '25+',
                label: 'Industry Awards',
                icon: FaMedal
            }
        ]
    },

    // Testimonials Section
    testimonials: {
        title: 'What Our Customers Say',
        quotes: [
            {
                text: 'The craftsmanship and attention to detail in my engagement ring is simply breathtaking. I couldn\'t be happier with my purchase.',
                author: 'Meera Kapoor',
                location: 'Mumbai'
            },
            {
                text: 'I\'ve been a loyal customer for over a decade. Their pieces are timeless, and their service is always exceptional.',
                author: 'Arjun Malhotra',
                location: 'Delhi'
            },
            {
                text: 'The custom necklace they created for my mother\'s 60th birthday brought tears to her eyes. A truly special piece from a truly special jeweler.',
                author: 'Sunita Reddy',
                location: 'Hyderabad'
            }
        ]
    },
    cta: {
        title: 'Visit Our Showroom',
        subtitle: 'Experience our collections in person',
        description: 'We invite you to visit one of our showrooms where our knowledgeable staff can guide you through our collections and help you find the perfect piece.',
        buttonText: 'Find a Store',
        buttonLink: '/stores',
        backgroundImage: '/images/about/showroom.jpg'
    }
};

// Import FaMapMarkerAlt which was referenced but not imported
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function AboutPage() {
    return (
        <Wrapper>
            {/* Hero Section */}
            <div className="relative bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    {ABOUT_INFO.hero.title}
                                </h1>
                                <p className="mt-3 text-base text-indigo-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    {ABOUT_INFO.hero.subtitle}
                                </p>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    {ABOUT_INFO.hero.description}
                                </p>
                                {/* <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link href={ABOUT_INFO.hero.ctaLink} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                                            {ABOUT_INFO.hero.ctaText}
                                        </Link>
                                    </div>
                                </div> */}
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <div className="h-56 w-full bg-gray-300 sm:h-72 md:h-96 lg:w-full lg:h-full relative">
                        {/* This would be replaced with an actual image in production */}
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <span className="text-lg">Jewelry Workshop Image</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="py-16 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                        <div>
                            {/* <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                {ABOUT_INFO.story.title}
                            </h2> */}
                            {/* <div className="mt-6 text-gray-500 space-y-6">
                                {ABOUT_INFO.story.content.map((paragraph, index) => (
                                    <p key={index} className="text-lg">
                                        {paragraph}
                                    </p>
                                ))}
                            </div> */}
                        </div>
                        {/* <div className="mt-12 lg:mt-0">
                            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
                                <div className="aspect-w-3 aspect-h-4 relative h-96">

                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                        <span className="text-lg">Founder Image</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900">{ABOUT_INFO.story.founderName}</h3>
                                    <p className="text-sm text-gray-500">{ABOUT_INFO.story.founderTitle}</p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            </Wrapper>
    );
}


