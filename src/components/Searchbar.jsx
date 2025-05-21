export default function SearchBar({ value, onChange }) {
    return (
        <input
            className="w-full mb-3 border px-2 py-1"
            placeholder="~search~"
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    );
}
