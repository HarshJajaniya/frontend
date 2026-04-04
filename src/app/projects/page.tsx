"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import CreateProject from "@/components/CreateProject";

const API_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://meetmom-backend.onrender.com"
    : "http://localhost:8000");

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = () => {
    setLoading(true);
    setError("");
    fetch(`${API_URL}/projects`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("Expected array from API, got:", data);
          setError("Invalid data format from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-bold">Projects</h1>
          <p className="text-gray-500 mt-2">
            Track and manage all projects with linked meetings and tasks.
          </p>
        </div>

        <CreateProject onCreated={fetchProjects} />
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}