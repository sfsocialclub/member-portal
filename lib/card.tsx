
interface CardProps {
    title?: string;
    description?: string;
    buttonProps?: {
        text?: string;
        onClick?: () => void;
    }
}
export const Card = ({ title, description, buttonProps }: CardProps) => {
    return (
        <div className="card max-w-96 w-full bg-base-100 card-md shadow-sm">
            <div className="card-body">
                {title && <h2 className="card-title">{title}</h2>}
                {description && <p>{description}</p>}
                {
                    buttonProps && (
                        <div className="justify-end card-actions">
                            <button onClick={buttonProps.onClick} className="btn btn-primary">{buttonProps.text}</button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}