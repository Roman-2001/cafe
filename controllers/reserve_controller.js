var tables = require('../models/table');
var console = require('console');
var async = require('async');
const { body,validationResult } = require('express-validator');

exports.table_reserve_get = function(req, res, next) {
    res.render('reserve_form', { title: 'Бронь столика'});
};

exports.table_reserve_post = [
    // Validate fields.
    body('time', 'Нужно выставить время')
    .trim()
    .escape(),

    body('date', 'Нужно выставить дату')
    .trim()
    .toDate()
    .escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                table: function(callback){
                    tables.find(callback)
                },
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('reserve_form', { title: 'Бронь столика', errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            async.parallel({
                table : function(callback) {
                    tables.findById(req.params.id)
                    .then(callback);
                },
            }, function(results) {
                console.log(results);
                if (results.length == 0) {
                    res.render("reserve_form", {title: "Бронь столика",
                                 errors: ["Нельзя забронировать несуществующий столик"]});
                    return;
                }
                //if(err) {return next(err);}
                var now = new Date();
                if (results.date_occupied != undefined) {
                for (var i = 0; i < results.date_occupied.length; i++){
                    if (checkTimeBefore(results.date_occupied[i], now))
                        results.date_occupied.splice(i, 1); //удалить из массива всё что раньше этой даты.
                }
                }
                var time = req.body.time.split(':');
                var hour = parseInt(time[0]);
                var minute = parseInt(time[1]);
                var date = new Date(req.body.date);
                date.setHours(hour);
                date.setMinutes(minute);
                if (results.date_occupied == null) {
                    var dates_occupied = [];
                }
                else {
                    dates_occupied = results.date_occupied;
                }
                if (checkTimeBefore(date, now)) {
                    res.render('reserve_form', {title: "Бронь столика", 
                    errors: ["Нельзя забронировать столик в прошлом"]});
                    return;
                }
                if (checkReservedDates(dates_occupied, date)){
                    res.render('reserve_form', {title: "Бронь столика", 
                    errors: ["Столик на это время уже забронирован. Выберите другое время"]});
                    return;
                }
                dates_occupied.push(date);
                tables.findByIdAndUpdate(results._id, 
                        {state: "Reserved",date_occupied: dates_occupied}).exec();
                var message = "Столик забронирован";
                res.render('success', {title: message}); 
            });
        }
    }
];

exports.cancel_table_reserve_get = function(req, res, next) {
    res.render('reserve_form', { title: 'Отмена брони столика'});
};

exports.cancel_table_reserve_post = function(req, res, next) {
        tables.findById(req.params.id)
            .then(function(result) {
            console.log(result);
            var date = new Date(req.body.date);
            var time = req.body.time.split(':');
            var hour = parseInt(time[0]);
            var minute = parseInt(time[1]);
            date.setHours(hour);
            date.setMinutes(minute);
            if (result.date_occupied != null){
                var dates = result.date_occupied;
            }
            else {
                var dates = [];
            }
            if (!hasDate(dates, date)) {
                res.render('reserve_form', { title: 'Отмена брони столика', 
                        errors: ["На эту дату столик не забронирован"]});
                return;
            }
            var index = result.date_occupied.indexOf(date);
            dates.splice(index, 1);
            var state = "Reserved";
            if (dates.length == 0) {
                state = "Available";
            }
            tables.findByIdAndUpdate(result._id, {state: state, date_occupied: dates}).exec();
            var format_date = date.toLocaleDateString();
            var format_time = date.toLocaleTimeString();
            message = "Бронь столика " + result.number + "\nна " + 
                        format_date + " " + format_time + "\nотменена";
            res.render('success', { title: message});
        }
    )
    };

var hasDate = function(dates, date) {
    for(var i=0;i<dates.length;i++){
        if (dates[i].getTime()==date.getTime()){
            return true;
        }
    }
    return false;
}

var checkTimeBefore = function(dateBefore, dateAfter) {
    return dateBefore < dateAfter;
}

var checkReservedDates = function(reservedDates, dateToReserve){
    if (reservedDates == null) {
        return false;
    }
    for(var i = 0; i < reservedDates.length; i++)
    {
        var reservedDatePlus = reservedDates[i].addHours(1);
        var reservedDateMinus = reservedDates[i].addHours(-1);
        if (reservedDatePlus > dateToReserve && reservedDateMinus < dateToReserve)
            return true;
    }
    return false;
}

Date.prototype.addHours = function(h) {
    var time = this.getTime() + h * 60 * 60 * 1000;
    return new Date(time);
}