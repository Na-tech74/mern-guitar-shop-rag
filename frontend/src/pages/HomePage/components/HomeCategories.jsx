import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGuitar } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "../../../components/Skeleton";

function buildTree(categories) {
    const map = {};
    const roots = [];
    categories.forEach((cat) => { map[cat._id] = { ...cat, children: [] }; });
    categories.forEach((cat) => {
        const node = map[cat._id];
        if (cat.parent?._id && map[cat.parent._id]) {
            map[cat.parent._id].children.push(node);
        } else if (!cat.parent) {
            roots.push(node);
        }
    });
    return roots;
}

const slugOf = (cat) => cat?.slug || (cat?.name || "").toLowerCase().replace(/\s+/g, "-");

function scrollToEl(el) {
    const headerHeight = document.querySelector("header")?.offsetHeight || 0;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top, behavior: "smooth" });
}

function findSection(slugs) {
    for (const s of slugs) {
        const el = document.getElementById(`fp-${s}`);
        if (el) return el;
    }
    return null;
}

export default function CategoriesSection({ categories, title, subtitle }) {
    const tree = buildTree(categories);

    const handleScroll = (slugs) => (e) => {
        e.preventDefault();
        const el = findSection(slugs);
        if (el) scrollToEl(el);
    };

    return (
        <section className="pt-10 sm:pt-12 pb-4 sm:pb-6 lg:pb-8 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{title || "Danh mục sản phẩm"}</h2>
                    <div className="w-16 h-1 bg-amber-400 rounded-full mx-auto mb-3" />
                    <p className="text-sm sm:text-base text-gray-500">{subtitle || "Lựa chọn danh mục phù hợp với nhu cầu của bạn"}</p>
                </div>
                {categories.length === 0 ? (
                    <Skeleton.CategoryCard count={6} />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {tree.slice(0,6).map((parent) => {
                            const slug = slugOf(parent);
                            const anchorId = `category-${slug}`;
                            const parentTargets = [slug, ...parent.children.map((c) => slugOf(c))];
                            return (
                            <div key={parent._id} id={anchorId} className="scroll-mt-[140px] group">
                                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full">
                                    <a
                                        href={`#fp-${slug}`}
                                        onClick={handleScroll(parentTargets)}
                                        className="block"
                                    >
                                        <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                                            {parent.image ? (
                                                <img
                                                    src={parent.image}
                                                    alt={parent.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faGuitar} className="text-3xl text-gray-200" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2.5 pb-1.5">
                                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base group-hover:text-amber-500 transition-colors truncate">{parent.name}</h3>
                                        </div>
                                    </a>
                                    <div className="px-2.5 pb-2.5">
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {parent.children.length > 0 ? (
                                                parent.children.map((child) => (
                                                    <a
                                                        key={child._id}
                                                        href={`#fp-${slugOf(child)}`}
                                                        onClick={handleScroll([slugOf(child), slug])}
                                                        className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded font-medium hover:bg-amber-100 hover:text-amber-600 transition-colors"
                                                    >
                                                        {child.name}
                                                    </a>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400">Xem sản phẩm</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
