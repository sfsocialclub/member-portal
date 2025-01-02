export enum CalendarLayout {
    calendar = 'Calendar view',
    list = 'List view'
}

interface ViewPickerProps {
    activeLayout: CalendarLayout,
    setActiveLayout: React.Dispatch<React.SetStateAction<CalendarLayout>>;
}

export const ViewPicker = ({ activeLayout, setActiveLayout }: ViewPickerProps) => {

    const handleClick = (layout: CalendarLayout) => () =>{
        const elem: HTMLElement = document.activeElement as HTMLElement;
        if (elem) {
          elem?.blur();
        }

        setActiveLayout(layout)
      };

    return (
        <div className="dropdown w-full">
            <div tabIndex={0} role="button" className="btn m-1">{activeLayout}</div>
            <ul tabIndex={0} className="menu dropdown-content bg-white rounded-box z-1 w-52 p-2 shadow-sm">
                <li><a onClick={handleClick(CalendarLayout.calendar)}>{CalendarLayout.calendar}</a></li>
                <li><a onClick={handleClick(CalendarLayout.list)}>{CalendarLayout.list}</a></li>
            </ul>
        </div>
    )
}