import { useState } from "react";
import { Box, Button, Input, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, Grid, Text, VStack } from "@chakra-ui/react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const DatePicker = ({ value, onChange, placeholder = "Seleccionar fecha..." }: DatePickerProps) => {
  const [month, setMonth] = useState<Date>(value ? new Date(value) : new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDayClick = (day: number) => {
    // Crear la fecha sin afectar la zona horaria
    const year = month.getFullYear();
    const monthNum = month.getMonth();
    const timepart = value ? new Date(value).toTimeString().split(" ")[0] : "00:00:00";
    
    // Crear la fecha en formato ISO directamente
    const dateString = `${year}-${String(monthNum + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isoString = `${dateString}T${timepart}`;
    onChange(isoString);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (!value) return;
    
    const datePart = value.split("T")[0];
    onChange(`${datePart}T${time}`);
  };

  const handlePrevMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNum = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const time = dateString.split("T")[1]?.slice(0, 5) || "00:00";
    return `${day}/${monthNum}/${year} ${time}`;
  };

  const daysInMonth = getDaysInMonth(month);
  const firstDay = getFirstDayOfMonth(month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, () => null);
  const monthName = month.toLocaleString("es-ES", { month: "long", year: "numeric" });
  const timeValue = value ? value.split("T")[1]?.slice(0, 5) : "";

  return (
    <Popover>
      <PopoverTrigger>
        <Box
          p={2}
          bg="white"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          cursor="pointer"
          fontSize="sm"
          _hover={{ borderColor: "gray.400" }}
        >
          {formatDate(value)}
        </Box>
      </PopoverTrigger>
      <PopoverContent p={4} width="auto">
        <PopoverArrow />
        <PopoverCloseButton />
        <VStack spacing={3}>
          {/* Month/Year Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Button size="sm" variant="ghost" onClick={handlePrevMonth}>
              ←
            </Button>
            <Text textTransform="capitalize" fontWeight="600" fontSize="sm">
              {monthName}
            </Text>
            <Button size="sm" variant="ghost" onClick={handleNextMonth}>
              →
            </Button>
          </Box>

          {/* Weekday Headers */}
          <Grid templateColumns="repeat(7, 1fr)" gap={1} width="100%">
            {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((day) => (
              <Text key={day} textAlign="center" fontSize="xs" fontWeight="600" color="gray.600">
                {day}
              </Text>
            ))}

            {/* Days */}
            {[...emptyDays, ...days].map((day, index) => (
              <Button
                key={index}
                size="sm"
                variant={day && value && new Date(value).getDate() === day ? "solid" : "ghost"}
                colorScheme={day && value && new Date(value).getDate() === day ? "orange" : "gray"}
                onClick={() => day && handleDayClick(day)}
                isDisabled={!day}
                fontSize="xs"
              >
                {day}
              </Button>
            ))}
          </Grid>

          {/* Time Input */}
          <Box width="100%">
            <Text fontSize="xs" fontWeight="600" mb={1}>
              Hora
            </Text>
            <Input
              type="time"
              size="sm"
              value={timeValue}
              onChange={handleTimeChange}
            />
          </Box>
        </VStack>
      </PopoverContent>
    </Popover>
  );
};
