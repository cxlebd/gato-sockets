const logic = {};

logic.home = (req, res)=>{
    res.render('index',{});
};

logic.start = (req, res)=>{
    res.render('getName',{});
};

logic.game = (req, res)=>{
    res.render('room',{});
};

module.exports = logic;