$baseDir = "c:\Users\BALAMURUGAN A\OneDrive\Desktop\patient-medications\drug-interaction-system"

# Folders to create
$folders = @(
    "frontend/public",
    "frontend/src/components/common",
    "frontend/src/components/patient",
    "frontend/src/components/drugs",
    "frontend/src/components/prediction",
    "frontend/src/components/visualization",
    "frontend/src/components/patterns",
    "frontend/src/components/layout",
    "frontend/src/pages",
    "frontend/src/services",
    "frontend/src/utils",
    "frontend/src/hooks",
    "frontend/src/context",
    "frontend/src/assets/images",
    "frontend/src/assets/icons",
    "frontend/src/assets/styles",
    "frontend/src/__tests__",
    "frontend/config",
    "backend/controllers",
    "backend/models",
    "backend/routes",
    "backend/middleware",
    "backend/config",
    "backend/services",
    "backend/utils",
    "backend/validations",
    "backend/constants",
    "backend/logs",
    "backend/__tests__",
    "ml-service/models/trained",
    "ml-service/models/experiments",
    "ml-service/preprocessing",
    "ml-service/fp_growth",
    "ml-service/random_forest",
    "ml-service/api",
    "ml-service/utils",
    "ml-service/config",
    "ml-service/tests",
    "ml-service/data/raw/drug_drug_interactions",
    "ml-service/data/raw/drug_condition",
    "ml-service/data/processed",
    "ml-service/data/external",
    "ml-service/notebooks",
    "data-processing/java-swing-app/src/main/java/com/druginteraction/gui",
    "data-processing/java-swing-app/src/main/java/com/druginteraction/processor",
    "data-processing/java-swing-app/src/main/java/com/druginteraction/model",
    "data-processing/java-swing-app/src/main/java/com/druginteraction/database",
    "data-processing/java-swing-app/src/main/java/com/druginteraction/utils",
    "data-processing/java-swing-app/src/main/resources",
    "data-processing/java-swing-app/src/test/java/com/druginteraction",
    "data-processing/java-swing-app/lib",
    "data-processing/java-swing-app/config",
    "data-processing/datasets/raw",
    "data-processing/datasets/processed",
    "data-processing/datasets/backups",
    "docs/api",
    "docs/architecture",
    "docs/user-guide",
    "docs/development",
    "docs/ml",
    "docs/requirements",
    "scripts/setup",
    "scripts/deployment",
    "scripts/database",
    "scripts/monitoring",
    "infrastructure/docker/frontend",
    "infrastructure/docker/backend",
    "infrastructure/docker/ml-service",
    "infrastructure/docker/nginx",
    "infrastructure/kubernetes",
    "infrastructure/terraform",
    "infrastructure/monitoring",
    ".github/workflows",
    ".github/ISSUE_TEMPLATE",
    ".vscode"
)

# Files to create
$files = @(
    "frontend/package.json",
    "frontend/src/App.js",
    "backend/server.js",
    "ml-service/app.py",
    "data-processing/java-swing-app/DrugDataProcessor.java",
    ".vscode/settings.json",
    ".gitignore",
    "README.md",
    "LICENSE",
    "docker-compose.yml"
)

Write-Host "Creating directories..."
foreach ($folder in $folders) {
    $fullPath = Join-Path $baseDir $folder
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Force -Path $fullPath | Out-Null
        Write-Host "Created Dir: $folder"
    }
}

Write-Host "Creating placeholder files..."
foreach ($file in $files) {
    $fullPath = Join-Path $baseDir $file
    if (-not (Test-Path $fullPath)) {
        # Ensure parent directory exists
        $parent = Split-Path $fullPath
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Force -Path $parent | Out-Null
        }
        New-Item -ItemType File -Force -Path $fullPath | Out-Null
        Write-Host "Created File: $file"
    }
}

Write-Host "`nScaffolding complete in $baseDir"
