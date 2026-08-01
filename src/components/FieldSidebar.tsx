"use client";
import React, {useState} from "react";
import {FieldType} from "../types/form";

interface FieldOption {
    type: FieldType;
    label: string;
    icon: string;
}

const GROUPS: {label: string; items: FieldOption[]}[] = [
    {
        label: "Text",
        items: [
            {type: "text", label: "Short answer", icon: "T"},
            {type: "email", label: "Email", icon: "@"},
        ],
    }
    {
        label: "Choices",
        items:[
            {type: "choice", label: "Multiple choice", icon: "◉"}, // peak icon i found lmao
            {type: "checkbox", label: "Checkbox", icon: "✓"},
        ],
    },
    {
        label: "Scale",
        items: [
            {type: "rating", label: "Rating", icon: "★"}
        ],
    },
];

export default function ({onAddField}:{onAddField:(type: FieldType)=> void}) {
    const [query, setQuery] = useState("");
    const term = query.trim().toLowerCase();

    const groups = GROUPS.map((group) => ({
            ...group, items: group.items.filter(
                (item) => item.label.toLowerCase().includes(term)||item.type.includes(term)
            ),
    }))
    .filter((group) => group.items.length > 0);

    return(
        <aside className={styles.sidebar}>
            <input type="search" className={styles.search} value={query}onChange={(e) => setQuery(e.target.value)} placeholder="Search fields"/>

            {groups.length === 0 ? (
                <p className={styles.noResults}>No fields are found</p>
            ):(
                groups.map((group) => (
                    <div key={group.label} className={styles.group}>
                        <h3 className={styles.groupLabel}>{group.label}</h3>
                        <div className={styles.optionGrid}>
                            {groups.items.map((item)=> (
                                <button key={item.type} type="button" onClick={() => onAddField(item.type)}>
                                    <span className={styles.optionIcon}>{item.icon}</span>
                                    <span className={styles.optionLabel}>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </aside>
    )
}