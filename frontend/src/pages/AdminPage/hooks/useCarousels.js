import { useState, useEffect } from "react";
import { carouselAPI } from "../api/adminAPI";

export const useCarousels = () => {
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCarousels = async () => {
        try {
            setLoading(true);
            const data = await carouselAPI.getAll();
            setCarousels(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createCarousel = async (formData) => {
        try {
            const data = new FormData();
            
            Object.keys(formData).forEach((key) => {
                const value = formData[key];
                if (key === "isActive") {
                    data.append(key, value ? "true" : "false");
                } else if (key === "order") {
                    data.append(key, value || 0);
                } else if (value !== null && value !== undefined) {
                    data.append(key, value);
                }
            });

            const response = await carouselAPI.create(data);
            setCarousels((prev) => [...prev, response.data]);
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const updateCarousel = async (id, formData) => {
        try {
            const data = new FormData();
            
            Object.keys(formData).forEach((key) => {
                const value = formData[key];
                if (key === "isActive") {
                    data.append(key, value ? "true" : "false");
                } else if (key === "order") {
                    data.append(key, value || 0);
                } else if (value !== null && value !== undefined) {
                    data.append(key, value);
                }
            });

            const response = await carouselAPI.update(id, data);
            setCarousels((prev) =>
                prev.map((item) => (item._id === id ? response.data : item))
            );
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const deleteCarousel = async (id) => {
        try {
            await carouselAPI.delete(id);
            setCarousels((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        fetchCarousels();
    }, []);

    return {
        carousels,
        loading,
        error,
        fetchCarousels,
        createCarousel,
        updateCarousel,
        deleteCarousel,
    };
};