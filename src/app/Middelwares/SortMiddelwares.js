function SortMiddelware(req, res, next) {

    res.locals._sort = {
        enabled: false,
        type: 'default',

    }
    if (req.query.hasOwnProperty('_sort')) {
        res.locals._sort.enabled = true;
        res.locals._sort.type = req.query.type;
        res.locals._sort.column = req.query.column;
    }
    next();
}

module.exports = { SortMiddelware };