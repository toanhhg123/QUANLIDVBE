const Mydata = require("../config/db/index");
class HomeController {
    rederGV(req, res, next) {
        async function run() {
            var data = await Mydata.conn;
            var sqlstring

            if (res.locals._sort.enabled)
                sqlstring = `SELECT * FROM GIAOVIEN WHERE Deleted = 0 ORDER BY ${res.locals._sort.column} ${res.locals._sort.type}; \n SELECT COUNT(*)as dem FROM GIAOVIEN WHERE Deleted =1;`;
            else
                sqlstring = `SELECT * FROM GIAOVIEN WHERE Deleted = 0; \n SELECT COUNT(*)as dem FROM GIAOVIEN WHERE Deleted =1;`;

            const Data = Promise.all([data.request().query(sqlstring)]);
            return Data;
        }
        run()
            .then(([Teachers]) => {
                let sum = 0;
                Teachers.recordset.forEach((s) => {
                    sum += s.dem;
                });
                res.render("giaovien/Teachers", {
                    Teachers: Teachers.recordsets[0],
                    count: Teachers.recordsets[1][0].dem,
                });
            })
            .catch((err) => res.send("loz hòa"));
    }

    RenderHome(req, res, next) {
        res.render("home");
    }

    async RenderUpdate(req, res, next) {
        var data = await Mydata.conn;
        var sqlstring = `select * from giaovien where magv = ${req.params.id}`;
        return data
            .request()
            .query(sqlstring)
            .then((Teacher) => {
                res.render("giaovien/updateTeacher", { Teacher: Teacher.recordset[0] });
            })
            .catch((err) => {
                res.send("lỗi");
            });
    }

    UpdateTeacher(req, res, next) {
        async function run() {
            var data = await Mydata.conn;
            var sqlstring = `UPDATE GIAOVIEN
                            SET HOTEN = N'${req.body.HOTEN}', LUONG = ${req.body.LUONG} , DIACHI = N'${req.body.DIACHI}'
                            WHERE MAGV = ${req.params.id}`;
            return await data.request().query(sqlstring);
        }
        run()
            .then(() => res.redirect("/data"))
            .catch((err) => res.send(err));
    }

    SearchTeacher(req, res, next) {
        async function run() {
            var data = await Mydata.conn;
            var sqlstring = `SELECT * from GIAOVIEN WHERE (GIAOVIEN.HOTEN LIKE N'%${req.body.name}%' Or GIAOVIEN.DIACHI like N'%${req.body.name}%' or GIAOVIEN.LUONG like '%${req.body.name}%') AND deleted=0 `;
            return data.request().query(sqlstring);
        }
        run()
            .then((data) =>
                res.render("giaovien/Teachers", {
                    Teachers: data.recordset,
                })
            )
            .catch((err) => res.send(err));
    }

    DeleteTeacher(req, res, next) {
        async function run() {
            var data = await Mydata.conn;
            const sqlString = `UPDATE GIAOVIEN SET Deleted = 1 where GIAOVIEN.MAGV = '${req.params.id}'`;
            return data.request().query(sqlString);
        }
        run()
            .then(() => {
                res.redirect("/data");
            })
            .catch((err) => {
                res.send("lỗi");
            });
    }

    async Action(req, res, next) {
        let str = "";
        var data = await Mydata.conn;
        switch (req.body.action) {
            case "delete":
                {
                    if (req.body.MAGV) {
                        req.body.MAGV.forEach((element) => {
                            str += `\nUPDATE GIAOVIEN SET Deleted = 1 where GIAOVIEN.MAGV = '${element}';`;
                        });
                    }
                    return data.request().query(str)
                        .then(() => { res.redirect('/data') })
                        .catch(err => res.send(err))
                }
                break;
            case "restore":
                {
                    if (req.body.MAGV) {
                        req.body.MAGV.forEach((element) => {
                            str += `\nUPDATE GIAOVIEN SET Deleted = 0 where GIAOVIEN.MAGV = '${element}';`;
                        });
                    }
                    return data.request().query(str)
                        .then(() => { res.redirect('/data') })
                        .catch(err => res.send(err))
                    break;
                }
            default:
                res.redirect("/data");
                break;
        }
    }

    // -- /data/trash
    async RenderTrash(req, res, next) {
        const data = await Mydata.conn;
        var str = `select * from GIAOVIEN WHERE Deleted = 1;`;
        return data
            .request()
            .query(str)
            .then((Teachers) => {
                res.render("giaovien/trash", { Teachers: Teachers.recordset });
            })
            .catch((err) => {
                res.send("lỗi");
            });
    }

    // /data/trash/:id
    async RestoreTeachers(req, res, next) {
        const data = await Mydata.conn;
        var str = `UPDATE GIAOVIEN SET Deleted = 0 where ${req.params.id} = MAGV`;
        return data
            .request()
            .query(str)
            .then(() => {
                res.redirect("back");
            })
            .catch((err) => {
                res.send("error");
            });
    }

    async GetIFTeacher(req, res, next) {
        const data = await Mydata.conn;
        const str = `SELECT GIAOVIEN.*, KHOA.* , BOMON.DIENTHOAI as DTMH , BOMON.PHONG as PHONGMH,BOMON.TENBM 
            from GIAOVIEN, BOMON, KHOA WHERE BOMON.MAKHOA = KHOA.MAKHOA AND GIAOVIEN.MABM = BOMON.MABM AND MAGV = ${req.params.id}`
        return data.request().query(str)
            .then((data) => {
                if (data.recordset[0])
                    res.render('giaovien/IFTeacher', { Teacher: data.recordset[0] });
                else
                    res.send('lỗi')
            })
            .catch((err) => { res.send('lỗi') })
    }
}
module.exports = new HomeController();