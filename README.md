# MeshGen - GameMaker Mesh Generator

An interactive web tool for generating meshes for GameMaker Studio projects using 2D lighting engines.

## 🎮 Compatible Engines

This generator is designed to work with:

- **[Glare Engine](https://tiz010.itch.io/glare-engine)** - 2D Lighting Engine by Tiz010
- **[Crystal 2D Lighting Engine](https://foxyofjungle.itch.io/crystal-2d-lighting-engine)** - 2D Lighting Engine by FoxyOfJungle

## 🚀 Quick Access

**🌐 [Access the application](https://chillman79.github.io/gm-sprite-mesh/)**

## 📖 How to Use

1. **Access the application** using the GitHub Pages link
2. **Create your mesh** using the drawing tools
4. **Export the generated code** for your GameMaker project
5. **Import the mesh** into your preferred lighting engine

## 🏗️ Local Development

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/chillman79/gm-sprite-mesh.git
cd gm-sprite-mesh

# Install dependencies
npm install
# or
bun install

# Run in development mode
npm run dev
# or
bun dev
```

### Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Static generation
npm run generate

# GitHub Pages build
npm run build:github
```

## 📁 Project Structure

```
meshgen/
├── app/
│   ├── components/     # Vue components
│   ├── composables/    # Reusable logic
│   ├── pages/         # Application pages
│   ├── types/         # TypeScript definitions
│   └── assets/        # Static resources
├── public/            # Public files
└── dist/              # Production build
```

## 🤝 Contributing

Contributions are welcome. Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Tiz010](https://tiz010.itch.io/glare-engine)** 
- **[FoxyOfJungle](https://foxyofjungle.itch.io/crystal-2d-lighting-engine)**
- **GameMaker Community** - For their continuous support and feedback
