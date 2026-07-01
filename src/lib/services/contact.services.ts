type Result = { status: 'success' } | { status: 'error'; err: unknown };

export interface FormData {
	name: string;
	email: string;
	msg: string;
}

export const sendMessage = async (args: { data: FormData }): Promise<Result> => {
	const execPostMessage = async () => {
		return await postMessage(args);
	};

	return await safeExec(execPostMessage);
};

const safeExec = async (fn: () => Promise<Result>): Promise<Result> => {
	try {
		return await fn();
	} catch (err: unknown) {
		return { status: 'error', err };
	}
};

const postMessage = async ({ data }: { data: FormData }): Promise<Result> => {
	const response = await fetch('http://localhost:5987', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		const text = await response.text();
		return { status: 'error', err: new Error(text) };
	}

	return { status: 'success' };
};
