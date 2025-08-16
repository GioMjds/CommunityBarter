function Footer() {
	return (
		<footer className="py-6 mt-12 bg-dark-background text-dark-foreground border-t border-gray-300 inset-shadow-gray-50">
			<div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-4">
				<p className="text-sm">
					© {new Date().getFullYear()}
					<span className="text-primary-dark"> Palitan Tayo </span>.
					All rights reserved.
				</p>
			</div>
		</footer>
	);
}

export default Footer;
