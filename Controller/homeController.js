const Home = require("../model/homePageModel")


const addSlide = async (req, res) => {
    try {

        const { images, links, section } = req.body;

        if (!images || !links || !section) {
            return res.json({
                message: "All fields are required"
            })
        }

        const home = await Home.create({
            images,
            links,
            section
        })

        if (!home) {
            return res.json({
                message: "Slide not Added"
            })
        }

        res.json({
            message: "Slide  added Sucessfully"
        })

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getSlidesBySection = async (req, res) => {
    try {
        const { section } = req.params;
        const slides = await Home.find({ section });

        if (!slides.length) {
            return res.json({
                message: "No slides found in this section"
            });
        }

        res.json(slides);
    }
    catch (err) {
        res.status(500).json(
            {
                message: err.message

            });
    }
};

const updateSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const { images, links, section } = req.body;

        const slide = await Home.findByIdAndUpdate(
            id,
            {
                images,
                links,
                section
            },
            {
                new: true
            }
        );

        if (!slide) {
            return res.json(
                {
                    message: "Slide not found"
                });
        }

        res.json(
            {
                message: "Slide updated successfully", slide
            });
    }
    catch (err) {
        res.status(500).json(
            {
                message: err.message

            });
    }
};

const deleteSlide = async (req, res) => {
    try {
        const { id } = req.params;

        const slide = await Home.findByIdAndDelete(id);

        if (!slide) {
            return res.json({ message: "Slide not found" });
        }

        res.json({ message: "Slide deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




module.exports = { addSlide,getSlidesBySection, updateSlide, deleteSlide }