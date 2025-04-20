'use client';

import {
    FaGem,
    FaCertificate,
    FaHandshake,
    FaHistory,
    FaUsers,
    FaMedal,
    FaHeart,
    FaMapMarkerAlt
} from 'react-icons/fa';
import Wrapper from '../components/Wrapper';
import Image from 'next/image';

// Centralized variables for easy maintenance
const ABOUT_INFO = {
    // Header Section
    hero: {
        title: 'About Shri Nanu Gems',
        subtitle: 'Your Trusted Destination for Premium Quality Jewellery',
        description: 'At Shri Nanu Gems, we specialize in crafting elegant and timeless pieces in Gold and Silver, along with exclusive gemstone jewellery. Every design we create reflects our commitment to quality, authenticity, and craftsmanship.',
        ctaText: 'View Our Collections',
        ctaLink: '/collections',
        heroImage: '/images/about/jewelry-workshop.jpg',
    },

    // Our Story Section
    story: {
        title: 'Our Story',
        content: [
            'With years of experience and a passion for fine jewellery, we bring you a unique collection that blends traditional beauty with modern style.',
            'Whether you\'re looking for the perfect engagement ring, a graceful necklace, or a custom gemstone bracelet, we are here to turn your vision into reality.',
            'Every piece we create is a testament to our dedication to excellence and our desire to be part of your most precious moments.'
        ],
        founderImage: '/images/about/founder.jpg',
        founderName: 'Shri Nanu Gems',
        founderTitle: 'Master Jewellers'
    },

    // Mission & Values Section
    mission: {
        title: 'Our Mission & Values',
        missionStatement: 'To create exquisite jewelry that celebrates life\'s precious moments, crafted with integrity, passion, and respect for tradition and quality.',
        values: [
            {
                title: 'Quality Craftsmanship',
                description: 'Every piece we create undergoes rigorous quality checks to ensure it meets our high standards.',
                icon: FaGem
            },
            {
                title: 'Authentic Materials',
                description: 'We use only the finest gold, silver, and genuine gemstones in all our creations.',
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

    // Stats Section
    stats: {
        title: 'By the Numbers',
        items: [
            {
                value: 'Years',
                label: 'of Expertise',
                icon: FaHistory
            },
            {
                value: 'Store',
                label: 'Location',
                icon: FaMapMarkerAlt
            },
            {
                value: 'Satisfied',
                label: 'Customers',
                icon: FaUsers
            },
            {
                value: 'Quality',
                label: 'Guarantee',
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
                text: 'I\'ve been a loyal customer for years. Their pieces are timeless, and their service is always exceptional.',
                author: 'Arjun Malhotra',
                location: 'Delhi'
            },
            {
                text: 'The custom necklace they created for my wedding brought tears to my eyes. A truly special piece from a truly special jeweler.',
                author: 'Sunita Reddy',
                location: 'Hyderabad'
            }
        ]
    },
    cta: {
        title: 'Visit Our Showroom',
        subtitle: 'Experience our collections in person',
        description: 'We invite you to visit our showroom where our knowledgeable staff can guide you through our collections and help you find the perfect piece.',
        buttonText: 'Find Us',
        buttonLink: '/contact',
        backgroundImage: '/images/about/showroom.jpg'
    }
};

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
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    {ABOUT_INFO.story.content[0]}
                                </p>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    {ABOUT_INFO.story.content[1]}
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
                    <div className="h-56 w-full  sm:h-72 md:h-96 lg:w-full lg:h-full relative">
                        {/* This would be replaced with an actual image in production */}
                        <div className="w-full h-full flex items-center justify-center">
                             <Image
                                             src="/logo.png"
                                             alt="Logo"
                                             width={120}
                                             height={40}
                                             className="h-60 w-auto"
                                           />
                        </div>
                    </div>
                </div>
            </div>

            {/* We've removed the Our Story Section as it's now integrated into the hero section */}
            </Wrapper>
    );
}