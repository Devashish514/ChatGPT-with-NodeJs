const axios = require("axios");
const apiKey = process.env.OPENAI_API_KEY;
const user = require("../models/user");

const client = axios.create({
    headers: {
        Authorization: "Bearer " + apiKey,
    },
});

const createInitialContent = async (req, res) => {
    try {
        let { topic, email } = req.body;
        const params = {
            prompt: `Write a blog on ${topic}`,
            model: "text-davinci-003",
            max_tokens: 10,
            temperature: 0.9,
            top_p: 1,
            presence_penalty: 0.6
        };
        client
            .post("https://api.openai.com/v1/completions", params)
            .then(async (result) => {
                console.log(result.data.choices[0].text);
                const storeData = await user.create({ email: email, content: result.data.choices[0].text });
                console.log(storeData);
                res.send({ data: storeData });
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const updateOtherContent = async (req, res) => {
    try {
        const findData = await user.findOne({ email: req.params.email });
        if (findData !== null) {
            let arr = [`generate hashtags for ${findData.content}`, `generate meta-title for ${findData.content}`];
            for (let i = 0; i < arr.length; i++) {
                const params = {
                    prompt: arr[i],
                    model: "text-davinci-003",
                    max_tokens: 10,
                    temperature: 0.9,
                    top_p: 1,
                    presence_penalty: 0.6
                };
                client
                    .post("https://api.openai.com/v1/completions", params)
                    .then(async (result) => {
                        if (result !== null || result !== undefined) {
                            console.log(result.data.choices[0].text);
                            if (i === 0) {
                                await user.findOneAndUpdate({ email: req.params.email }, { $push: { hashtags: result.data.choices[0].text } }, { new: true });

                            }
                            if (i === 1) {
                                await user.findOneAndUpdate({ email: req.params.email }, { $push: { metadata: result.data.choices[0].text } }, { new: true });
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            return res.status(200).send({ message: "Success" });
        } else {
            return res.status(404).send('not found');
        }
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}

const getAllUser = async (req, res) => {
    const find = await user.find();
    res.send({ data: find })
}

module.exports = {
    updateOtherContent,
    createInitialContent,
    getAllUser
}