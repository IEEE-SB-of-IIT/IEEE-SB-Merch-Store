"use client";
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-theme-bg pt-24 pb-12 border-t border-theme-accent transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Newsletter Section */}
                <div className="bg-theme-accent rounded-3xl p-12 mb-20 text-center relative overflow-hidden transition-colors duration-500">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <span className="text-xs font-bold text-theme-secondary tracking-widest uppercase mb-4 block">Newsletter</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-theme-text mb-8">Subscribe our newsletter</h2>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter Your Email..."
                                className="flex-1 bg-theme-bg rounded-full px-6 py-4 text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary transition-colors"
                            />
                            <button className="bg-theme-text text-theme-bg px-8 py-4 rounded-full font-bold hover:opacity-80 transition-colors flex items-center justify-center gap-2">
                                Subscribe <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-theme-primary opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-theme-primary opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-theme-accent pb-12 mb-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-theme-text">
                            IEEE SB Store
                        </Link>
                        <p className="text-theme-secondary text-sm">
                            Official merchandise for the IEEE Student Branch. High quality apparel for our community.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-theme-bg border border-theme-accent flex items-center justify-center hover:border-theme-primary hover:text-theme-primary transition-colors cursor-pointer text-theme-secondary">
                                    <Icon className="w-4 h-4" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-bold text-theme-text mb-6 uppercase text-sm tracking-wider">Support</h4>
                        <ul className="space-y-4 text-theme-secondary text-sm">
                            <li><a href="#" className="hover:text-theme-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-theme-primary transition-colors">FAQs</a></li>
                            <li><a href="#" className="hover:text-theme-primary transition-colors">Order Status</a></li>
                            <li><a href="#" className="hover:text-theme-primary transition-colors">Returns</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-theme-text mb-6 uppercase text-sm tracking-wider">Company</h4>
                        <ul className="space-y-4 text-theme-secondary text-sm">
                            <li><a href="#" className="hover:text-theme-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-theme-primary transition-colors">Our Team</a></li>
                            <li><a href="#" className="hover:text-theme-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-theme-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-theme-text mb-6 uppercase text-sm tracking-wider">Legal</h4>
                        <ul className="space-y-4 text-theme-secondary text-sm">
                            <li><a href="#" className="hover:text-theme-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-theme-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-theme-primary transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-theme-secondary">
                    <p>© 2024 IEEE Student Branch. All rights reserved.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-theme-primary">Privacy Policy</a>
                        <a href="#" className="hover:text-theme-primary">Terms & Conditions</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
