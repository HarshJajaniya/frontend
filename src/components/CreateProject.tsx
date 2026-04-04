"use client";

import { useEffect, useState } from "react";

type Meeting = {
	id: string;
	title: string;
};

type Task = {
	id: string;
	task: string;
	meeting?: { title?: string };
};

type CreateProjectProps = {
	onCreated: () => void;
};

export default function CreateProject({ onCreated }: CreateProjectProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [meetings, setMeetings] = useState<Meeting[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [selectedMeetingIds, setSelectedMeetingIds] = useState<string[]>([]);
	const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
	const [loadingOptions, setLoadingOptions] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!open) return;

		const loadOptions = async () => {
			setLoadingOptions(true);
			setError("");
			try {
				const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
				const [meetingsRes, tasksRes] = await Promise.all([
					fetch(`${SERVER}/meetings`, { credentials: "include" }),
					fetch(`${SERVER}/tasks/all`, { credentials: "include" })
				]);

				if (!meetingsRes.ok || !tasksRes.ok) {
					throw new Error("Failed to load meetings/tasks");
				}

				const meetingsData = await meetingsRes.json();
				const tasksData = await tasksRes.json();

				setMeetings(Array.isArray(meetingsData) ? meetingsData : []);
				setTasks(Array.isArray(tasksData) ? tasksData : []);
			} catch (err: any) {
				setError(err.message || "Could not load options");
			} finally {
				setLoadingOptions(false);
			}
		};

		loadOptions();
	}, [open]);

	const toggleMeeting = (meetingId: string) => {
		setSelectedMeetingIds((prev) =>
			prev.includes(meetingId)
				? prev.filter((id) => id !== meetingId)
				: [...prev, meetingId]
		);
	};

	const toggleTask = (taskId: string) => {
		setSelectedTaskIds((prev) =>
			prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
		);
	};

	const resetForm = () => {
		setName("");
		setDescription("");
		setSelectedMeetingIds([]);
		setSelectedTaskIds([]);
		setError("");
		setOpen(false);
	};

	const handleCreate = async () => {
		if (!name.trim()) {
			setError("Project name is required");
			return;
		}

		setSaving(true);
		setError("");

		try {
			const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
			const res = await fetch(`${SERVER}/projects`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: name.trim(),
					description: description.trim(),
					meetingIds: selectedMeetingIds,
					taskIds: selectedTaskIds,
				}),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message || "Failed to create project");
			}

			resetForm();
			onCreated();
		} catch (err: any) {
			setError(err.message || "Failed to create project");
		} finally {
			setSaving(false);
		}
	};

	if (!open) {
		return (
			<button
				onClick={() => setOpen(true)}
				className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
			>
				Create Project
			</button>
		);
	}

	return (
		<div className="bg-white border rounded-xl p-5 w-full max-w-xl shadow">
			<h3 className="text-lg font-semibold mb-4">Create Project</h3>

			<div className="space-y-3">
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Project name"
					className="w-full border rounded-lg px-3 py-2"
				/>

				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Description"
					className="w-full border rounded-lg px-3 py-2"
					rows={3}
				/>

				<div>
					<p className="text-sm font-medium mb-2">Link Meetings</p>
					<div className="max-h-32 overflow-auto border rounded-lg p-2 space-y-1">
						{loadingOptions ? (
							<p className="text-sm text-gray-500">Loading...</p>
						) : meetings.length === 0 ? (
							<p className="text-sm text-gray-500">No meetings found</p>
						) : (
							meetings.map((meeting) => (
								<label key={meeting.id} className="flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										checked={selectedMeetingIds.includes(meeting.id)}
										onChange={() => toggleMeeting(meeting.id)}
									/>
									<span>{meeting.title}</span>
								</label>
							))
						)}
					</div>
				</div>

				<div>
					<p className="text-sm font-medium mb-2">Link Tasks</p>
					<div className="max-h-32 overflow-auto border rounded-lg p-2 space-y-1">
						{loadingOptions ? (
							<p className="text-sm text-gray-500">Loading...</p>
						) : tasks.length === 0 ? (
							<p className="text-sm text-gray-500">No tasks found</p>
						) : (
							tasks.map((task) => (
								<label key={task.id} className="flex items-center gap-2 text-sm">
									<input
										type="checkbox"
										checked={selectedTaskIds.includes(task.id)}
										onChange={() => toggleTask(task.id)}
									/>
									<span>
										{task.task}
										{task.meeting?.title ? ` (${task.meeting.title})` : ""}
									</span>
								</label>
							))
						)}
					</div>
				</div>

				{error ? <p className="text-sm text-red-600">{error}</p> : null}

				<div className="flex gap-2 justify-end">
					<button
						onClick={resetForm}
						className="px-4 py-2 border rounded-lg"
						disabled={saving}
					>
						Cancel
					</button>
					<button
						onClick={handleCreate}
						className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-60"
						disabled={saving}
					>
						{saving ? "Creating..." : "Create"}
					</button>
				</div>
			</div>
		</div>
	);
}

