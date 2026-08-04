"use client";
import React, {useState} from "react";
import {FIELD_TYPES, FIELD_GROUPS} from "../lib/fieldTypes";
import {FieldType} from "../types/form";
import styles from "../styles/FieldSidebar.module.css";


const GROUPS = FIELD_GROUPS.map((label)=> ({
    label, items: (Object.keys(FIELD_TYPES) as FieldType[]).filter((type)=> FIELD_TYPES[type].group === label).map((type)=>({type,...FIELD_TYPES[type]})),
}));

export default function FieldSidebar({onAddField}:{onAddField:(type: FieldType)=> void}) {
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
            <input type="search" className={styles.search} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fields"/>

            {groups.length === 0 ? (
                <p className={styles.noResults}>No fields are found</p>
            ):(
                groups.map((group) => (
                    <div key={group.label} className={styles.group}>
                        <h3 className={styles.groupLabel}>{group.label}</h3>
                        <div className={styles.optionGrid}>
                            {group.items.map((item)=> (
                                <button key={item.type} type="button" className={styles.option} onClick={() => onAddField(item.type)}>
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