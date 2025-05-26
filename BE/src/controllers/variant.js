import Variant from "../models/variant";

export const createVariant = async (req, res) => {
    try {
        const variant = await Variant.create(req.body);
        res.status(201).json(variant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const removeVariant = async (req, res) => {
    const id = req.params.id;
    try {
        // console.log(id)
        const variant = await Variant.findOneAndDelete({ _id: id });
        if (variant.length < 0) {
            return res.status(500).json({ message: "Variant not found" })
        }
        // console.log(variant)
        return res.status(200).json(variant);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}