'use strict';
 
const log = require('ohj').log('time_of_day');
const { rules, items, triggers } = require('ohj');

const JSJoda = require('js-joda');
const LocalDateTime = JSJoda.LocalDateTime;
const LocalTime = JSJoda.LocalTime;

const ISO8601Formatter = JSJoda.DateTimeFormatter.ofPattern("uuuu-MM-dd'T'HH:mm:ss.SSS[xxxx][xxxxx]");

//these don't change
const MORNING_START_STR = "06:00";
const EVENING_START_STR = "19:30";
const NIGHT_START_STR = "20:30";

const MORNING_START_CRON = "0 0 06 * * ? *";
const EVENING_START_CRON = "0 30 19 * * ? *";
const NIGHT_START_CRON = "0 30 20 * * ? *";

const MORNING_START = LocalTime.parse(MORNING_START_STR);
const EVENING_START = LocalTime.parse(EVENING_START_STR);
const NIGHT_START = LocalTime.parse(NIGHT_START_STR);

const getTimeFromItem = function (itemName, now_dt) {
  log.debug("Getting time from item {}", itemName);
  let item_dt_str = items.getItem(itemName).state;
  log.debug("time from item " + itemName + " is " + item_dt_str);
  let item_zdt = JSJoda.ZonedDateTime.parse(item_dt_str, ISO8601Formatter);

  if (!item_zdt.toLocalDate().equals(now_dt.toLocalDate())) {
    log.warn("Astro time for {} is desynchronised; falling back to time on {}", itemName, item_zdt.toLocalDate());
  }
 
  return item_zdt.toLocalTime();
};
  
var update = function () {
  log.debug("Calculating time of day...")

  var now_dt = LocalDateTime.now();

  var day_start = getTimeFromItem('vSunrise_Time', now_dt);
  var sunset_start = getTimeFromItem('vSunset_Time', now_dt);
  var presunset_start = sunset_start.minusMinutes(90); //calculate presunset as I cannot get an item to correctly adopt the time
  //var presunset_start = getTimeFromItem('vPresunset_Time', now_dt);

  var now = now_dt.toLocalTime();

  var curr = "UNKNOWN"

  if (now.isAfter(NIGHT_START) || now.isBefore(MORNING_START)) {
    curr = "NIGHT"
  } else if (now.isBefore(day_start)) {
    curr = "MORNING"
  } else if (now.isBefore(presunset_start)) {
    curr = "DAY"
  } else if (now.isBefore(sunset_start)) {
    curr = "PRESUNSET"
  } else if (now.isBefore(EVENING_START)) {
    curr = "SUNSET"
  } else if (now.isBefore(NIGHT_START)) {
    curr = "EVENING"
  } else {
    log.error("Unable to calculate time of day from time: " + now);
  }

  // Publish the current state
  log.info("Calculated time of day is " + curr);
  items.getItem('vTimeOfDay').sendCommandIfDifferent(curr);
}

rules.JSRule({
  name: "time of day",
  description: "Calculates and Updates the time of day",
  triggers: [
    triggers.GenericCronTrigger("0 0 1 * * ? *"), //once Astro has updated things
    triggers.GenericCronTrigger(MORNING_START_CRON),
    triggers.GenericCronTrigger(EVENING_START_CRON),
    triggers.GenericCronTrigger(NIGHT_START_CRON),
    triggers.ChannelEventTrigger('astro:sun:home:rise#event', 'START'),
    triggers.ChannelEventTrigger('astro:sun:home:set#event', 'START'),
    triggers.ChannelEventTrigger('astro:sun:minus90:set#event', 'START')
  ],
  execute: () => update()
})

// run at startup & deploy time
update();