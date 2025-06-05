function Footer() {
    return (
      <footer className="bg-red-500 h-60 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </footer>
    );
}

export default Footer;