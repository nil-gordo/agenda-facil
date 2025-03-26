
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
}

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Simulated available dates
const availableDates = [3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26];

// Simulated time slots
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 19;
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minutes of [0, 30]) {
      const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      slots.push({
        time,
        available: Math.random() > 0.3, // Randomly set some as unavailable
      });
    }
  }
  
  return slots;
};

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots());

  // Get month details
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay() || 7; // Convert Sunday (0) to 7
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 1; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateSelection = (day: number) => {
    if (availableDates.includes(day)) {
      setSelectedDate(day);
      setSelectedTime(null);
      setTimeSlots(generateTimeSlots()); // Generate new time slots when date changes
    }
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  const isDateAvailable = (day: number) => {
    return availableDates.includes(day);
  };

  const isDateInPast = (day: number) => {
    const today = new Date();
    if (currentYear < today.getFullYear()) return true;
    if (currentYear === today.getFullYear() && currentMonth < today.getMonth()) return true;
    if (currentYear === today.getFullYear() && currentMonth === today.getMonth() && day < today.getDate()) return true;
    return false;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-primary px-4 py-3 text-white">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="font-medium text-lg">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Days */}
      <div className="px-4 py-4">
        {/* Weekdays Header */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {calendarDays.map((day, index) => (
            <div key={index} className="aspect-square">
              {day !== null ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`h-full w-full rounded-full flex items-center justify-center text-sm
                    ${selectedDate === day ? 'bg-primary text-white' : ''}
                    ${isDateAvailable(day) && !isDateInPast(day) ? 'hover:bg-primary/10 cursor-pointer' : 'cursor-default'}
                    ${isDateInPast(day) ? 'text-muted-foreground/40' : isDateAvailable(day) ? 'text-foreground' : 'text-muted-foreground/60'}
                  `}
                  onClick={() => {
                    if (isDateAvailable(day) && !isDateInPast(day)) {
                      handleDateSelection(day);
                    }
                  }}
                  disabled={!isDateAvailable(day) || isDateInPast(day)}
                >
                  {day}
                </motion.button>
              ) : (
                <div className="h-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-3">
                  Horarios disponibles - {selectedDate} {monthNames[currentMonth]}
                </h4>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                  {timeSlots.map((slot, i) => (
                    <motion.button
                      key={i}
                      className={`px-2 py-1.5 text-sm rounded-md border ${
                        !slot.available ? 'bg-muted text-muted-foreground cursor-not-allowed' : 
                        selectedTime === slot.time ? 'bg-primary text-primary-foreground border-primary' : 
                        'hover:border-primary hover:text-primary cursor-pointer'
                      }`}
                      whileHover={{ scale: slot.available ? 1.05 : 1 }}
                      whileTap={{ scale: slot.available ? 0.95 : 1 }}
                      onClick={() => slot.available && handleTimeSelection(slot.time)}
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CalendarView;
