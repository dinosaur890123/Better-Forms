"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {signUp} from "../auth/actions";
import styles from "../../styles/Auth.module.css"; // note to self to make this later

export default function SignUp() {
    const [email, setEmail] = useState("");
    
}