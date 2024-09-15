import childProcess from 'node:child_process';

// Global setup runs inside Node.js, not `workerd`
export default function (): void {
	const label = 'Built workers-library dependencies';
	console.time(label);
	// build mock-ra
	childProcess.execSync('npm run build:mocks', {
		cwd: __dirname,
	});
	console.timeEnd(label);
}
