import Carousel from "../models/carousel.model.js";
import { uploadImages } from "../services/uploadImages.js";

export const getAllCarousels =async(req, res) => {
    const carousels = await Carousel.find().sort({ order: 1 });
    res.json(carousels);
};

export const getActiveCarousels = async (req, res) => {
    const carousels = await Carousel.find({ isActive: true }).sort({ order: 1 });
    res.json(carousels);
};

export const getCarouselById = async (req, res) => {
    const carousel = await Carousel.findById(req.params.id);
    if (!carousel) {
        return res.status(404).json({ message: "Carousel không tìm thấy" });
    }
    res.json(carousel);
};

export const createCarousel = async (req, res) => {
    const { title, subtitle, description, cta, path, isActive, order } = req.body;

    let image = req.body.image;
    if (req.files && req.files.length > 0) {
        const uploadedImages = await uploadImages(req.files, "carousel");
        image = uploadedImages[0];
    }

    const carousel = new Carousel({
        title,
        subtitle,
        description,
        image,
        cta,
        path,
        isActive: isActive === "true" || isActive === true,
        order: order || 0
    });

    const createdCarousel = await carousel.save();
    res.status(201).json(createdCarousel);
};

export const updateCarousel = async (req, res) => {
    const { title, subtitle, description, cta, path, isActive, order } = req.body;

    const carousel = await Carousel.findById(req.params.id);
    if (!carousel) {
        return res.status(404).json({ message: "Carousel không tìm thấy" });
    }

    carousel.title = title || carousel.title;
    carousel.subtitle = subtitle !== undefined ? subtitle : carousel.subtitle;
    carousel.description = description !== undefined ? description : carousel.description;
    carousel.cta = cta || carousel.cta;
    carousel.path = path || carousel.path;
    carousel.isActive = isActive === "true" || isActive === true || isActive === "false" ? isActive === "true" || isActive === true : carousel.isActive;
    carousel.order = order !== undefined ? order : carousel.order;

    if (req.files && req.files.length > 0) {
        const uploadedImages = await uploadImages(req.files, "carousel");
        carousel.image = uploadedImages[0];
    }

    const updatedCarousel = await carousel.save();
    res.json(updatedCarousel);
};

export const deleteCarousel = async (req, res) => {
    const carousel = await Carousel.findById(req.params.id);
    if (!carousel) {
        return res.status(404).json({ message: "Carousel không tìm thấy" });
    }

    await carousel.deleteOne();
    res.json({ message: "Xóa carousel thành công" });
};