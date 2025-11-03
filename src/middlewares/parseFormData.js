const parseFormData = (req, res, next) => {
    const jsonFields = ['variants'];

    jsonFields.forEach(field => {
        if (typeof req.body[field] === 'string') {
            try {
                req.body[field] = JSON.parse(req.body[field]);
            } catch (err) {
                console.warn(`Không thể parse ${field}:`, err.message);
            }
        }
    });

    next();
};

module.exports = parseFormData
