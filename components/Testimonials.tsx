"use client";
import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: "John Doe",
        role: "Member",
        text: "The quality is simply outstanding. The fabric feels premium and the fit is perfect.",
        rating: 5,
    },
    {
        id: 2,
        name: "Jane Smith",
        role: "Student",
        text: "Love the design! It represents our branch perfectly. Highly recommended.",
        rating: 5,
    },
    {
        id: 3,
        name: "Mike Ross",
        role: "Alumni",
        text: "Great to see such cool merch for IEEE. The delivery was fast and packaging was eco-friendly.",
        rating: 5,
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-theme-bg transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                <h2 className="text-4xl font-black text-theme-text mb-16">Testimonials</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="text-left p-8 bg-theme-accent rounded-3xl hover:shadow-lg transition-all duration-300">
                            <div className="flex gap-1 mb-6">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-theme-primary fill-theme-primary" />
                                ))}
                            </div>
                            <p className="text-theme-secondary text-sm mb-8 leading-relaxed">
                                "{review.text}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-theme-bg rounded-full border border-theme-secondary/20"></div>
                                <div>
                                    <h4 className="font-bold text-theme-text text-sm">{review.name}</h4>
                                    <span className="text-xs text-theme-secondary">{review.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
