import axios from 'axios';

/**
 * Service to handle AI-based complaint analysis
 * Uses external AI model API for classification
 */

/**
 * Analyze complaint text and media to determine type, subtype, and severity
 * @param {Object} complaintData - Contains description, media links, and other relevant data
 * @returns {Object} Analysis results with type, subtype, and severity
 */
export const analyzeComplaint = async (complaintData) => {
    try {
        const { description = "", media = [], pnrDetails } = complaintData;
        
        // Prepare data for the AI model API
        const requestData = {
            text: description,
            image_urls: media.filter(url => url.match(/\.(jpeg|jpg|png|gif|webp)$/i)),
            video_urls: media.filter(url => url.match(/\.(mp4|mov|avi|wmv|mkv|webm)$/i)),
            audio_urls: media.filter(url => url.match(/\.(mp3|wav|ogg|m4a|aac)$/i))
        };
        
        // Make API call to the AI model
        const response = await axios.post(
            'http://localhost:5000/test/classify-complaint',
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 seconds timeout
            }
        );
        
        // If the API call is successful
        if (response.data && response.status === 200) {
            // Extract the type, subtype and severity from the response
            // Adjust this based on your actual API response structure
            const {
                type = "Coach-Cleanliness",
                subtype = "Washbasin",
                severity = "Medium",
            } = response.data;
            
            return {
                type: type.toUpperCase(),
                subtype: subtype.toUpperCase(),
                severity: severity.toUpperCase()
            };
        } else {
            // If the API doesn't return the expected data
            console.warn("AI model API returned unexpected data:", response.data);
            return {
                type: "Coach-Cleanliness",
                subtype: "Washbasin",
                severity: "Medium",
            };
        }
        
    } catch (error) {
        console.error("Error calling AI model API:", error.message);
        // Return default values in case of error
        return {
            type: "Coach-Cleanliness",
            subtype: "Washbasin",
            severity: "Medium",
        };
    }
};