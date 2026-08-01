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

    const GROUPS
}