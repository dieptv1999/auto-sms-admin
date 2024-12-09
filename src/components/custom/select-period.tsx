
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SelectPeriod({value, onChange}: {value: string, onChange: (val: string) => void}) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="day">Trong ngày</SelectItem>
                    <SelectItem value="day_ago">Hôm qua</SelectItem>
                    <SelectItem value="week">Tuần này</SelectItem>
                    <SelectItem value="week_ago">Tuần trước</SelectItem>
                    <SelectItem value="month">Tháng này</SelectItem>
                    <SelectItem value="year">Một năm</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}