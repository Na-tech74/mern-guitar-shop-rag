import categoryModel from "../models/category.model.js";
import { appError } from "../common/appError.js";
import { createSlug } from "../utils/slug.js";
import {
    formatSuccessResponse,
    sanitizeText
} from "../utils/format.js";

export const createCategory = async (req, res) => {
    const { name, description } = req.body;

    if (req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    }

    if (!name || !description) {
        throw appError("Missing fields!", 400);
    }

    const createCategory = await categoryModel.create({
        name: sanitizeText(name),
        slug: createSlug(name),
        description: sanitizeText(description)
    });

    return res.status(201).json(formatSuccessResponse(
        'Category created successfully!',
        createCategory
    ));
};

export const getAllCategory = async (req, res) => {
    const category = await categoryModel.find();

    if (!category || category.length === 0) {
        throw appError("Category not found!", 404);
    }

    return res.json(formatSuccessResponse(
        'Categories retrieved successfully!',
        category
    ));
};

export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    if (!category) {
        throw appError("Category not found!", 404);
    }

    return res.json(formatSuccessResponse(
        'Category retrieved successfully!',
        category
    ));
};

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    }

    const category = await categoryModel.findById(id);
    if (!category) {
        throw appError("Category not found!", 404);
    }

    if (name) {
        category.name = sanitizeText(name);
        category.slug = createSlug(name);
    }
    if (description) {
        category.description = sanitizeText(description);
    }

    await category.save();

    return res.json(formatSuccessResponse(
        'Category updated successfully!',
        category
    ));
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    }

    const category = await categoryModel.findById(id);
    if (!category) {
        throw appError("Category not found!", 404);
    }

    await category.deleteOne();

    return res.json(formatSuccessResponse(
        'Category deleted successfully!'
    ));
};