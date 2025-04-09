/**
 * Resume and Portfolio Generation Service
 * 
 * Handles creating, exporting, and sharing resumes and portfolios
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import axios from 'axios';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Generate PDF from HTML element
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {string} filename - Name for the output file
 * @returns {Promise<Blob>} - PDF file as Blob
 */
export const generatePDF = async (element, filename = 'resume.pdf') => {
  if (!element) {
    throw new Error('Element is required for PDF generation');
  }
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      format: 'a4',
      unit: 'mm'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;
    
    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(filename);
    
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Publish portfolio online
 * @param {Object} portfolioData - The portfolio data to publish
 * @returns {Promise<Object>} - Response with the published URL
 */
export const publishPortfolio = async (portfolioData) => {
  try {
    // This would connect to your backend API
    const response = await axios.post(`${API_URL}/api/portfolio/publish`, portfolioData);
    return response.data;
  } catch (error) {
    console.error('Error publishing portfolio:', error);
    throw error;
  }
};

/**
 * Get a shareable link for a resume
 * @param {Object} resumeData - The resume data to share
 * @returns {Promise<Object>} - Response with the shareable link
 */
export const getResumeShareLink = async (resumeData) => {
  try {
    // This would connect to your backend API
    const response = await axios.post(`${API_URL}/api/resume/share`, resumeData);
    return response.data;
  } catch (error) {
    console.error('Error generating share link:', error);
    throw error;
  }
};

/**
 * Get resume templates
 * @returns {Array} - Available resume templates
 */
export const getResumeTemplates = () => {
  return [
    { id: 'modern', name: 'Modern', color: '#3f51b5' },
    { id: 'classic', name: 'Classic', color: '#2e7d32' },
    { id: 'minimal', name: 'Minimal', color: '#424242' },
    { id: 'creative', name: 'Creative', color: '#d32f2f' },
  ];
};

/**
 * Get portfolio templates
 * @returns {Array} - Available portfolio templates
 */
export const getPortfolioTemplates = () => {
  return [
    { id: 'professional', name: 'Professional', color: '#1976d2' },
    { id: 'creative', name: 'Creative', color: '#9c27b0' },
    { id: 'minimal', name: 'Minimal', color: '#616161' },
    { id: 'developer', name: 'Developer', color: '#00796b' },
  ];
};

// Mock function for development only
export const mockPublishPortfolio = (portfolioData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomId = Math.random().toString(36).substring(2, 10);
      resolve({
        success: true,
        url: `https://portfolios.example.com/${randomId}`,
        portfolioId: randomId
      });
    }, 2000);
  });
};

// Mock function for development only
export const mockShareResume = (resumeData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomId = Math.random().toString(36).substring(2, 10);
      resolve({
        success: true,
        url: `https://resumes.example.com/${randomId}`,
        resumeId: randomId
      });
    }, 1500);
  });
};

export default {
  generatePDF,
  publishPortfolio,
  getResumeShareLink,
  getResumeTemplates,
  getPortfolioTemplates,
  // Development helpers
  mockPublishPortfolio,
  mockShareResume
}; 